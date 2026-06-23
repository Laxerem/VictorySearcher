namespace VictorySearcher.Service.Application.Vacancies.Dtos;

public record VacancyDto(
    Guid Id,
    string Title,
    string Description,
    string Requirements,
    string? ExtraRequirements,
    DateTime CreatedAt);
