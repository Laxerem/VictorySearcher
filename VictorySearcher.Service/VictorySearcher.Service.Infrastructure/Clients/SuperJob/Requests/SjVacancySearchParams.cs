namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob.Requests;

public record SjVacancySearchParams(
    int CatalogueKey,
    int TownId,
    int? Experience,
    bool NoAgreement,
    int Page,
    int Count,
    DateTimeOffset? DatePublishedFrom = null,
    DateTimeOffset? DatePublishedTo = null
);
