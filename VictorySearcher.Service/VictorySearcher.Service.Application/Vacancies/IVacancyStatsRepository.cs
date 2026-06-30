namespace VictorySearcher.Service.Application.Vacancies;

public interface IVacancyStatsRepository {
    Task<IReadOnlyList<VacancyStats>> GetAllAsync(CancellationToken ct = default);
    Task<int> GetTotalResumeCountAsync(CancellationToken ct = default);
}
