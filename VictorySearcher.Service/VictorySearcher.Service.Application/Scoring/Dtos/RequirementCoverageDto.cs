namespace VictorySearcher.Service.Application.Scoring.Dtos;

public record RequirementCoverageDto(
    string Requirement,
    bool Covered,
    string Evidence);
