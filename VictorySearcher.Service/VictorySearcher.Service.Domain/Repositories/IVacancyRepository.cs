using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Domain.Repositories;

public interface IVacancyRepository
{
    Task<Vacancy?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Vacancy>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Vacancy vacancy, CancellationToken ct = default);
    Task DeleteAsync(Vacancy vacancy, CancellationToken ct = default);
}
