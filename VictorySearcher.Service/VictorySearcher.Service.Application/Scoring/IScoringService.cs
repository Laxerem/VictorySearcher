using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Application.Scoring;

public interface IScoringService {
    Task<Result<Guid>> EnqueueAsync(Guid vacancyId, CancellationToken ct = default);
    Task<Result<ScoringStatusDto>> GetStatusAsync(Guid vacancyId, CancellationToken ct = default);
    Task<Result<List<ScoringResultDto>>> GetResultsAsync(Guid vacancyId, CancellationToken ct = default);
}
