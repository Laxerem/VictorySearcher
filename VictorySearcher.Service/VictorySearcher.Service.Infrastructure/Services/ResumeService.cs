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
        if (Path.GetExtension(fileName).ToLowerInvariant() != ".txt")
            return Result<Guid>.Failure("invalid_format");

        var vacancy = await vacancyRepository.GetByIdAsync(vacancyId, ct);
        if (vacancy is null) return Result<Guid>.Failure("not_found");

        var fileId = Guid.NewGuid();
        var dir = Path.Combine(storageOptions.Value.UploadsPath, vacancyId.ToString());
        var filePath = Path.Combine(dir, $"{fileId}.txt");

        Directory.CreateDirectory(dir);

        await using (var fs = File.Create(filePath)) {
            await content.CopyToAsync(fs, ct);
        }

        var resume = new Resume {
            Id = fileId,
            VacancyId = vacancyId,
            FileName = fileName,
            FilePath = filePath,
            Format = FileFormat.TXT,
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
            return Result<ResumeContentDto>.Failure("not_found");

        var content = await parserDispatcher.ParseAsync(resume, ct);
        return Result<ResumeContentDto>.Success(new ResumeContentDto(resume.FileName, content));
    }

    public async Task<Result<ResumeFileDto>> GetFileAsync(
        Guid vacancyId, Guid resumeId, CancellationToken ct = default) {
        var resume = await resumeRepository.GetByIdAsync(resumeId, ct);
        if (resume is null || resume.VacancyId != vacancyId)
            return Result<ResumeFileDto>.Failure("not_found");

        var data = await File.ReadAllBytesAsync(resume.FilePath, ct);
        return Result<ResumeFileDto>.Success(new ResumeFileDto(resume.FileName, resume.Format, data));
    }
}
