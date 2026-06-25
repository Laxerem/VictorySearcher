using Microsoft.Extensions.Options;
using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Application.Resumes.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Options;
using VictorySearcher.Service.Infrastructure.Services.Parsers;

namespace VictorySearcher.Service.Infrastructure.Services;

public class ResumeService(
    IResumeRepository resumeRepository,
    IVacancyRepository vacancyRepository,
    IUnitOfWork unitOfWork,
    IOptions<StorageOptions> storageOptions,
    ResumeParserDispatcher parserDispatcher) : IResumeService {

    public async Task<Result<Guid>> UploadAsync(
        Guid vacancyId,
        string fileName,
        Stream content,
        CancellationToken ct = default) {
        var detected = DetectFormat(fileName);
        if (detected is null)
            return Result<Guid>.Failure(AppError.BadRequest("Only .txt, .docx, and .pdf files are supported."));

        var (format, ext) = detected.Value;

        var vacancy = await vacancyRepository.GetByIdAsync(vacancyId, ct);
        if (vacancy is null) return Result<Guid>.Failure(AppError.NotFound());

        var fileId = Guid.NewGuid();
        var dir = Path.Combine(storageOptions.Value.UploadsPath, vacancyId.ToString());
        var filePath = Path.Combine(dir, $"{fileId}{ext}");

        Directory.CreateDirectory(dir);

        await using (var fs = File.Create(filePath)) {
            await content.CopyToAsync(fs, ct);
        }

        var resume = new Resume {
            Id = fileId,
            VacancyId = vacancyId,
            FileName = fileName,
            FilePath = filePath,
            Format = format,
            LoadedAt = DateTime.UtcNow
        };

        await resumeRepository.AddAsync(resume, ct);

        try {
            await unitOfWork.SaveChangesAsync(ct);
        } catch {
            File.Delete(filePath);
            throw;
        }

        return Result<Guid>.Success(resume.Id);
    }

    private static (FileFormat Format, string Ext)? DetectFormat(string fileName) =>
        Path.GetExtension(fileName).ToLowerInvariant() switch {
            ".txt" => (FileFormat.TXT, ".txt"),
            ".docx" => (FileFormat.DOCX, ".docx"),
            ".pdf" => (FileFormat.PDF, ".pdf"),
            _ => null
        };

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
                r.LoadedAt,
                r.ScoringResults.Count > 0))
            .ToList();

        return Result<PagedResumesDto>.Success(new PagedResumesDto(
            items,
            totalCount,
            page,
            pageSize,
            scoredCount,
            totalCount - scoredCount));
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

        var data = await File.ReadAllBytesAsync(resume.FilePath, ct);
        return Result<ResumeFileDto>.Success(new ResumeFileDto(resume.FileName, resume.Format, data));
    }
}
