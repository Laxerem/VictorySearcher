using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Persistence;

namespace VictorySearcher.Service.Infrastructure.Repositories;

public class ScoringResultRepository(AppDbContext db) : IScoringResultRepository {
    public async Task<IReadOnlyList<ScoringResult>> GetByRequestIdAsync(Guid requestId, CancellationToken ct = default)
        => await db.ScoringResults
            .Where(r => r.RequestId == requestId)
            .Include(r => r.Resume)
            .OrderByDescending(r => r.OverallScore)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<ScoringResult>> GetLatestByVacancyIdAsync(
        Guid vacancyId, CancellationToken ct = default)
        => await db.ScoringResults
            .Where(r => r.Request.VacancyId == vacancyId)
            .Where(r => !db.ScoringResults.Any(other =>
                other.ResumeId == r.ResumeId &&
                other.Request.VacancyId == vacancyId &&
                other.ScoredAt > r.ScoredAt))
            .Include(r => r.Resume)
            .OrderByDescending(r => r.OverallScore)
            .ToListAsync(ct);

    public Task AddAsync(ScoringResult result, CancellationToken ct = default) {
        db.ScoringResults.Add(result);
        return Task.CompletedTask;
    }

    public Task AddRangeAsync(IEnumerable<ScoringResult> results, CancellationToken ct = default) {
        db.ScoringResults.AddRange(results);
        return Task.CompletedTask;
    }
}
