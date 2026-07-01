namespace VictorySearcher.Service.Application.Vacancies.Dtos;

public record VacancyDto(
    Guid Id,
    string Title,
    string Description,
    string Requirements,
    string? ExtraRequirements,
    string? Trend,
    DateTime CreatedAt,
    int TotalResumes,
    int ScoredResumes,
    int UnscoredResumes);
