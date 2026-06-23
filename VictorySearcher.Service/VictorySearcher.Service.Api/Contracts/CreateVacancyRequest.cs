namespace VictorySearcher.Service.Api.Contracts;

public record CreateVacancyRequest(
    string Title,
    string Description,
    string Requirements,
    string? ExtraRequirements);
