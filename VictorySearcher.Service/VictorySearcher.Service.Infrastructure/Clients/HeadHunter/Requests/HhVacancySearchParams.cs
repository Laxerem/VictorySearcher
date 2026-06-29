namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Requests;

public record HhVacancySearchParams(
    int ProfessionalRoleId,
    int AreaId,
    string? Experience,
    bool OnlyWithSalary,
    int Page,
    int PerPage,
    DateTimeOffset? DateFrom = null,
    DateTimeOffset? DateTo = null
);
