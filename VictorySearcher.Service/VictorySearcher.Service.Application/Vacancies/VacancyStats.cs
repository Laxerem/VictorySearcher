namespace VictorySearcher.Service.Application.Vacancies;

public record VacancyStats(
    Guid Id,
    int ResumeCount,
    int CheckedResumeCount,
    int BestScore
);
