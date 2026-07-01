using VictorySearcher.Service.Application.Vacancies;
using VictorySearcher.Service.Application.Vacancies.Dtos;

namespace VictorySearcher.Service.Application.Extensions;

public static class VacanciesExtensions {
    public static VacancyListItemDto ToDto(this IReadOnlyList<VacancyStats> stats, int totalResumes) =>
        new(stats.Count, totalResumes, stats.Select(s => new VacancyItemDto(s.Id, s.Title, s.Trend, s.ResumeCount, s.CheckedResumeCount, s.BestScore)).ToList());
}
