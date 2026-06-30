using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Resumes.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Application.Resumes;

public class ResumeService(
    IResumeRepository resumeRepository,
    IVacancyRepository vacancyRepository,
    IUnitOfWork unitOfWork,
    IResumeStorage resumeStorage,
    ResumeParserDispatcher parserDispatcher) : IResumeService {

    public async Task<Result<Guid>> UploadAsync(
        Guid vacancyId,
        string fileName,
        long fileSizeBytes,
        Stream content,
        CancellationToken ct = default) {
        var detected = DetectFormat(fileName);
        if (detected is null)
            return Result<Guid>.Failure(AppError.BadRequest("Only .txt, .docx, and .pdf files are supported."));

        var (format, ext) = detected.Value;

        var vacancy = await vacancyRepository.GetByIdAsync(vacancyId, ct);
        if (vacancy is null) return Result<Guid>.Failure(AppError.NotFound());

        var fileId = Guid.NewGuid();
        var filePath = await resumeStorage.SaveAsync(vacancyId, fileId, ext, content, ct);

        var resume = new Resume {
            Id = fileId,
            VacancyId = vacancyId,
            FileName = fileName,
            FilePath = filePath,
            Format = format,
            FileSizeBytes = fileSizeBytes,
            LoadedAt = DateTime.UtcNow
        };

        await resumeRepository.AddAsync(resume, ct);

        try {
            await unitOfWork.SaveChangesAsync(ct);
        } catch {
            resumeStorage.Delete(filePath);
            throw;
        }

        return Result<Guid>.Success(resume.Id);
    }

    public async Task<Result<PagedResumesDto>> GetPagedAsync(
        Guid vacancyId, int page, int pageSize, CancellationToken ct = default) {
        var resumes = await resumeRepository.GetPagedByVacancyIdAsync(vacancyId, page, pageSize, ct);
        var totalCount = await resumeRepository.GetCountByVacancyIdAsync(vacancyId, ct);
        var scoredCount = await resumeRepository.GetScoredCountByVacancyIdAsync(vacancyId, ct);

        var items = resumes
            .Select(r => new ResumeListItemDto(
                r.Id,
                r.FileName,
                r.Format,
                r.FileSizeBytes,
                r.LoadedAt,
                r.ScoringResults.Count > 0))
            .ToList();

        return Result<PagedResumesDto>.Success(new PagedResumesDto(
            totalCount,
            page,
            pageSize,
            scoredCount,
            totalCount - scoredCount,
            items
            )
        );
    }

    public async Task<Result<ResumeContentDto>> GetContentAsync(
        Guid vacancyId, Guid resumeId, CancellationToken ct = default) {
        var resume = await resumeRepository.GetByIdAsync(resumeId, ct);
        if (resume is null || resume.VacancyId != vacancyId)
            return Result<ResumeContentDto>.Failure(AppError.NotFound());

        var content = await parserDispatcher.ParseAsync(resume, ct);
        return Result<ResumeContentDto>.Success(new ResumeContentDto(resume.FileName, content));
    }

    public async Task<Result<ResumeFileDto>> GetFileAsync(
        Guid vacancyId, Guid resumeId, CancellationToken ct = default) {
        var resume = await resumeRepository.GetByIdAsync(resumeId, ct);
        if (resume is null || resume.VacancyId != vacancyId)
            return Result<ResumeFileDto>.Failure(AppError.NotFound());

        var data = await resumeStorage.ReadAllBytesAsync(resume.FilePath, ct);
        return Result<ResumeFileDto>.Success(new ResumeFileDto(resume.FileName, resume.Format, data));
    }

    private static (FileFormat Format, string Ext)? DetectFormat(string fileName) {
        var ext = Path.GetExtension(fileName);
        var format = FileFormatExtensions.FromFileExtension(ext);
        return format is null ? null : (format.Value, format.Value.ToFileExtension());
    }
}
