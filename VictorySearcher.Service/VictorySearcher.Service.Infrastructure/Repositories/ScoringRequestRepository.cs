using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Persistence;

namespace VictorySearcher.Service.Infrastructure.Repositories;

public class ScoringRequestRepository(AppDbContext db) : IScoringRequestRepository {
    public Task<ScoringRequest?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => db.ScoringRequests.FirstOrDefaultAsync(r => r.Id == id, ct);

    public Task<ScoringRequest?> GetLatestByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default)
        => db.ScoringRequests
            .Where(r => r.VacancyId == vacancyId)
            .OrderByDescending(r => r.CreatedAt)
            .FirstOrDefaultAsync(ct);

    public Task AddAsync(ScoringRequest request, CancellationToken ct = default) {
        db.ScoringRequests.Add(request);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(ScoringRequest request, CancellationToken ct = default) {
        db.ScoringRequests.Update(request);
        return Task.CompletedTask;
    }
}
