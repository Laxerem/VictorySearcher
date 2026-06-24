namespace VictorySearcher.Service.Infrastructure.Clients.Contracts;

public record RequirementAnalysisItem(
    string Requirement,
    bool Covered,
    string Evidence);
