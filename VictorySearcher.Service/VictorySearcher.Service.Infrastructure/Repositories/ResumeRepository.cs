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

    public Task AddRangeAsync(IEnumerable<Resume> resumes, CancellationToken ct = default) {
        db.Resumes.AddRange(resumes);
        return Task.CompletedTask;
    }
}
