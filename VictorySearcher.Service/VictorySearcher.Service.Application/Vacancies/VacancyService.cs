using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Vacancies.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Application.Vacancies;

public class VacancyService(IVacancyRepository vacancyRepository, IUnitOfWork unitOfWork) : IVacancyService {
    public async Task<Result<VacancyDto>> CreateAsync(
        string title, string description, string requirements, string? extraRequirements,
        Guid createdById, CancellationToken ct = default) {
        var vacancy = new Vacancy {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            Requirements = requirements,
            ExtraRequirements = extraRequirements,
            CreatedById = createdById,
            CreatedAt = DateTime.UtcNow
        };

        await vacancyRepository.AddAsync(vacancy, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result<VacancyDto>.Success(MapToDto(vacancy));
    }

    public async Task<Result<IReadOnlyList<VacancyListItemDto>>> GetAllAsync(CancellationToken ct = default) {
        var vacancies = await vacancyRepository.GetAllAsync(ct);
        var dtos = vacancies.Select(v => new VacancyListItemDto(v.Id, v.Title)).ToList();
        return Result<IReadOnlyList<VacancyListItemDto>>.Success(dtos);
    }

    public async Task<Result<VacancyDto>> GetByIdAsync(Guid id, CancellationToken ct = default) {
        var vacancy = await vacancyRepository.GetByIdAsync(id, ct);
        if (vacancy is null)
            return Result<VacancyDto>.Failure(AppError.NotFound());

        return Result<VacancyDto>.Success(MapToDto(vacancy));
    }

    public async Task<Result<bool>> DeleteAsync(Guid id, CancellationToken ct = default) {
        var vacancy = await vacancyRepository.GetByIdAsync(id, ct);
        if (vacancy is null)
            return Result<bool>.Failure(AppError.NotFound());

        await vacancyRepository.DeleteAsync(vacancy, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result<bool>.Success(true);
    }

    private static VacancyDto MapToDto(Vacancy v) =>
        new(v.Id, v.Title, v.Description, v.Requirements, v.ExtraRequirements, v.CreatedAt);
}
