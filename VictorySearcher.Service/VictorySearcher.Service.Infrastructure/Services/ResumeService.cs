using Microsoft.Extensions.Options;
using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Services;

public class ResumeService(
    IResumeRepository resumeRepository,
    IVacancyRepository vacancyRepository,
    IUnitOfWork unitOfWork,
    IOptions<StorageOptions> storageOptions) : IResumeService {
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
}
