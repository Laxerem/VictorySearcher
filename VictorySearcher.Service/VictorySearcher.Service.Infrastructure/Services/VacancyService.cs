using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Vacancies;
using VictorySearcher.Service.Application.Vacancies.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Infrastructure.Services;

public class VacancyService(IVacancyRepository vacancyRepository, IUnitOfWork unitOfWork) : IVacancyService {
    public async Task<Result<VacancyDto>> CreateAsync(
        string title,
        string description,
        string requirements,
        string? extraRequirements,
        Guid createdById,
        CancellationToken ct = default) {
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

        return Result<VacancyDto>.Success(new VacancyDto(
            vacancy.Id,
            vacancy.Title,
            vacancy.Description,
            vacancy.Requirements,
            vacancy.ExtraRequirements,
            vacancy.CreatedAt));
    }
}
