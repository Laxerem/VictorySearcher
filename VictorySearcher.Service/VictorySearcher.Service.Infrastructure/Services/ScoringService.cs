using Hangfire;
using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Jobs;

namespace VictorySearcher.Service.Infrastructure.Services;

public class ScoringService(
    IVacancyRepository vacancyRepository,
    IScoringRequestRepository scoringRequestRepository,
    IScoringResultRepository scoringResultRepository,
    IBackgroundJobClient backgroundJobClient,
    IUnitOfWork unitOfWork) : IScoringService {

    public async Task<Result<Guid>> EnqueueAsync(Guid vacancyId, CancellationToken ct = default) {
        var vacancy = await vacancyRepository.GetByIdAsync(vacancyId, ct);
        if (vacancy is null) return Result<Guid>.Failure(AppError.NotFound());

        var request = new ScoringRequest {
            Id = Guid.NewGuid(),
            VacancyId = vacancyId,
            Status = ScoringStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await scoringRequestRepository.AddAsync(request, ct);
        await unitOfWork.SaveChangesAsync(ct);

        backgroundJobClient.Enqueue<ResumeScoringJob>(job => job.ExecuteAsync(request.Id, CancellationToken.None));

        return Result<Guid>.Success(request.Id);
    }

    public async Task<Result<ScoringStatusDto>> GetStatusAsync(Guid vacancyId, CancellationToken ct = default) {
        var request = await scoringRequestRepository.GetLatestByVacancyIdAsync(vacancyId, ct);
        if (request is null) return Result<ScoringStatusDto>.Failure(AppError.NotFound());

        return Result<ScoringStatusDto>.Success(MapToStatusDto(request));
    }

    public async Task<Result<List<ScoringResultDto>>> GetResultsAsync(Guid vacancyId, CancellationToken ct = default) {
        var vacancy = await vacancyRepository.GetByIdAsync(vacancyId, ct);
        if (vacancy is null) return Result<List<ScoringResultDto>>.Failure(AppError.NotFound());

        var results = await scoringResultRepository.GetLatestByVacancyIdAsync(vacancyId, ct);

        var dtos = results
            .Select(r => new ScoringResultDto(
                r.ResumeId,
                r.Resume.FileName,
                r.OverallScore,
                r.ExperienceScore,
                r.SkillsScore,
                r.ExtraScore,
                r.Reasoning,
                r.IsUncertain,
                r.RequirementsAnalysis
                    .Select(c => new RequirementCoverageDto(c.Requirement, c.Covered, c.Evidence))
                    .ToList(),
                r.ScoredAt))
            .ToList();

        return Result<List<ScoringResultDto>>.Success(dtos);
    }

    private static ScoringStatusDto MapToStatusDto(ScoringRequest request) =>
        new(request.Status, request.ErrorMessage, request.CreatedAt, request.FinishedAt);
}
