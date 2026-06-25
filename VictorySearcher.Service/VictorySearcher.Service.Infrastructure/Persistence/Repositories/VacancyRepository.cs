using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Persistence;

namespace VictorySearcher.Service.Infrastructure.Repositories;

public class VacancyRepository(AppDbContext db) : IVacancyRepository {
    public Task<Vacancy?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => db.Vacancies.FirstOrDefaultAsync(v => v.Id == id, ct);

    public async Task<IReadOnlyList<Vacancy>> GetAllAsync(CancellationToken ct = default)
        => await db.Vacancies
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync(ct);

    public Task AddAsync(Vacancy vacancy, CancellationToken ct = default) {
        db.Vacancies.Add(vacancy);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Vacancy vacancy, CancellationToken ct = default) {
        db.Vacancies.Remove(vacancy);
        return Task.CompletedTask;
    }
}
