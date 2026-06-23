using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Domain.Repositories;

public interface IScoringRequestRepository
{
    Task<ScoringRequest?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ScoringRequest?> GetLatestByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default);
    Task AddAsync(ScoringRequest request, CancellationToken ct = default);
    Task UpdateAsync(ScoringRequest request, CancellationToken ct = default);
}
