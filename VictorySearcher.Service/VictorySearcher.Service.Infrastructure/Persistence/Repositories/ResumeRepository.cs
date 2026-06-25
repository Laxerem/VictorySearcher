using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Persistence;

namespace VictorySearcher.Service.Infrastructure.Repositories;

public class ResumeRepository(AppDbContext db) : IResumeRepository {
    public Task<Resume?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => db.Resumes.FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<IReadOnlyList<Resume>> GetByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default)
        => await db.Resumes
            .Where(r => r.VacancyId == vacancyId)
            .OrderBy(r => r.LoadedAt)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Resume>> GetPagedByVacancyIdAsync(
        Guid vacancyId, int page, int pageSize, CancellationToken ct = default)
        => await db.Resumes
            .Where(r => r.VacancyId == vacancyId)
            .Include(r => r.ScoringResults)
            .OrderByDescending(r => r.LoadedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

    public Task<int> GetCountByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default)
        => db.Resumes.CountAsync(r => r.VacancyId == vacancyId, ct);

    public Task<int> GetScoredCountByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default)
        => db.Resumes.CountAsync(r => r.VacancyId == vacancyId && r.ScoringResults.Any(), ct);

    public async Task<IReadOnlyList<Resume>> GetUnscoredByVacancyIdAsync(
        Guid vacancyId, CancellationToken ct = default)
        => await db.Resumes
            .Where(r => r.VacancyId == vacancyId && !r.ScoringResults.Any())
            .OrderBy(r => r.LoadedAt)
            .ToListAsync(ct);

    public Task AddAsync(Resume resume, CancellationToken ct = default) {
        db.Resumes.Add(resume);
        return Task.CompletedTask;
    }

    public Task AddRangeAsync(IEnumerable<Resume> resumes, CancellationToken ct = default) {
        db.Resumes.AddRange(resumes);
        return Task.CompletedTask;
    }
}
