namespace VictorySearcher.Service.Application.Scoring.Dtos;

public record LlmAnalysisDto(
    int OverallScore,
    int ExperienceScore,
    int SkillsScore,
    int? ExtraScore,
    string Reasoning,
    bool Incongruity,
    bool IsUncertain,
    IReadOnlyList<RequirementCoverageDto> RequirementsAnalysis);
