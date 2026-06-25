using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Extensions;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Application.Scoring;

public class ScoringService(
    IVacancyRepository vacancyRepository,
    IScoringRequestRepository scoringRequestRepository,
    IScoringResultRepository scoringResultRepository,
    IScoringJobScheduler jobScheduler,
    IScoringProgressChannel progressChannel,
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

        progressChannel.Create(request.Id);
        jobScheduler.Schedule(request.Id);

        return Result<Guid>.Success(request.Id);
    }

    public async Task<Result<List<ScoringResultDto>>> GetResultsAsync(Guid vacancyId, CancellationToken ct = default) {
        var vacancy = await vacancyRepository.GetByIdAsync(vacancyId, ct);
        if (vacancy is null) return Result<List<ScoringResultDto>>.Failure(AppError.NotFound());

        var results = await scoringResultRepository.GetLatestByVacancyIdAsync(vacancyId, ct);

        var dtos = results
            .Select(r => r.ToDto())
            .ToList();

        return Result<List<ScoringResultDto>>.Success(dtos);
    }

    public async Task<Result<IAsyncEnumerable<ScoringProgressEvent>>> StreamProgressAsync(
        Guid vacancyId, CancellationToken ct = default) {
        var request = await scoringRequestRepository.GetLatestByVacancyIdAsync(vacancyId, ct);
        if (request is null)
            return Result<IAsyncEnumerable<ScoringProgressEvent>>.Failure(AppError.NotFound());

        if (request.Status is ScoringStatus.Finished or ScoringStatus.Failed)
            return Result<IAsyncEnumerable<ScoringProgressEvent>>.Failure(
                AppError.Conflict("Scoring has already finished. Fetch results via GET /results."));

        var stream = progressChannel.TryGetReader(request.Id);
        if (stream is null)
            return Result<IAsyncEnumerable<ScoringProgressEvent>>.Failure(AppError.Unavailable());

        return Result<IAsyncEnumerable<ScoringProgressEvent>>.Success(stream);
    }

    public async Task<Result<ScoringStatusDto>> GetStatusAsync(Guid vacancyId, CancellationToken ct = default) {
        var request = await scoringRequestRepository.GetLatestByVacancyIdAsync(vacancyId, ct);
        if (request is null) return Result<ScoringStatusDto>.Failure(AppError.NotFound());

        return Result<ScoringStatusDto>.Success(MapToStatusDto(request));
    }

    private static ScoringStatusDto MapToStatusDto(ScoringRequest request) =>
        new(request.Status, request.ErrorMessage, request.CreatedAt, request.FinishedAt);
}
