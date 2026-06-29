namespace VictorySearcher.Service.Infrastructure.Clients.Llm.Responses;

public record RequirementAnalysisItem(
    string Requirement,
    bool Covered,
    string Evidence);
