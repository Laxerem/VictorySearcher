using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Domain.Repositories;

public interface IScoringResultRepository {
    Task<IReadOnlyList<ScoringResult>> GetByRequestIdAsync(Guid requestId, CancellationToken ct = default);
    Task AddAsync(ScoringResult result, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<ScoringResult> results, CancellationToken ct = default);
}
