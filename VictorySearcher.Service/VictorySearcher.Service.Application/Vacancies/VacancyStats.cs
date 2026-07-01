namespace VictorySearcher.Service.Application.Vacancies;

public record VacancyStats(
    Guid Id,
    string Title,
    string? Trend,
    int ResumeCount,
    int CheckedResumeCount,
    int BestScore
);
