using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Vacancies;
using VictorySearcher.Service.Application.Vacancies.Dtos;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Infrastructure.Services;

public class VacancyService : IVacancyService {
    private readonly IVacancyRepository _vacancyRepository;
    private readonly IUnitOfWork _unitOfWork;
    public VacancyService(IVacancyRepository vacancyRepository, IUnitOfWork unitOfWork) {
        _vacancyRepository = vacancyRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<VacancyDto>> CreateAsync(string title, string description, string requirements, string? extraRequirements,
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

        await _vacancyRepository.AddAsync(vacancy, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<VacancyDto>.Success(new VacancyDto(
            vacancy.Id,
            vacancy.Title,
            vacancy.Description,
            vacancy.Requirements,
            vacancy.ExtraRequirements,
            vacancy.CreatedAt));
    }

    public async Task<Result<IReadOnlyList<VacancyListItemDto>>> GetAllAsync(CancellationToken ct = default) {
        var vacancies = await _vacancyRepository.GetAllAsync(ct);
        var dtos = vacancies.Select(v => new VacancyListItemDto(v.Id, v.Title)).ToList();
        return Result<IReadOnlyList<VacancyListItemDto>>.Success(dtos);
    }

    public async Task<Result<VacancyDto>> GetByIdAsync(Guid id, CancellationToken ct = default) {
        var vacancy = await _vacancyRepository.GetByIdAsync(id, ct);
        if (vacancy is null)
            return Result<VacancyDto>.Failure(AppError.NotFound());

        return Result<VacancyDto>.Success(new VacancyDto(
            vacancy.Id,
            vacancy.Title,
            vacancy.Description,
            vacancy.Requirements,
            vacancy.ExtraRequirements,
            vacancy.CreatedAt));
    }

    public async Task<Result<bool>> DeleteAsync(Guid id, CancellationToken ct = default) {
        var vacancy = await _vacancyRepository.GetByIdAsync(id, ct);
        if (vacancy is null)
            return Result<bool>.Failure(AppError.NotFound());

        await _vacancyRepository.DeleteAsync(vacancy, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<bool>.Success(true);
    }
}
