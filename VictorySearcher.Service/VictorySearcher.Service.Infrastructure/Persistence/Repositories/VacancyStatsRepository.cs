using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Application.Vacancies;
using VictorySearcher.Service.Infrastructure.Persistence;

namespace VictorySearcher.Service.Infrastructure.Repositories;

public class VacancyStatsRepository(AppDbContext db) : IVacancyStatsRepository {
    public async Task<IReadOnlyList<VacancyStats>> GetAllAsync(CancellationToken ct = default)
        => await db.Vacancies
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new VacancyStats(
                v.Id,
                v.Title,
                v.Trend,
                v.Resumes.Count(),
                v.Resumes.Count(r => r.ScoringResults.Any()),
                v.Resumes.SelectMany(r => r.ScoringResults).Max(sr => (int?)sr.OverallScore) ?? 0
            ))
            .ToListAsync(ct);

    public Task<int> GetTotalResumeCountAsync(CancellationToken ct = default)
        => db.Resumes.CountAsync(ct);

    public Task<VacancyStats?> GetByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default)
        => db.Vacancies
            .Where(v => v.Id == vacancyId)
            .Select(v => new VacancyStats(
                v.Id,
                v.Title,
                v.Trend,
                v.Resumes.Count(),
                v.Resumes.Count(r => r.ScoringResults.Any()),
                v.Resumes.SelectMany(r => r.ScoringResults).Max(sr => (int?)sr.OverallScore) ?? 0
            ))
            .FirstOrDefaultAsync(ct);
}
