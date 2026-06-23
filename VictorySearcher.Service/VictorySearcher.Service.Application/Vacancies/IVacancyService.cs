using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Vacancies.Dtos;

namespace VictorySearcher.Service.Application.Vacancies;

public interface IVacancyService {
    Task<Result<VacancyDto>> CreateAsync(
        string title,
        string description,
        string requirements,
        string? extraRequirements,
        Guid createdById,
        CancellationToken ct = default);

    Task<Result<IReadOnlyList<VacancyListItemDto>>> GetAllAsync(CancellationToken ct = default);

    Task<Result<VacancyDto>> GetByIdAsync(Guid id, CancellationToken ct = default);
}
