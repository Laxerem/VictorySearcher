namespace VictorySearcher.Service.Infrastructure.Clients.Contracts;

public record LlmResponseJson(
    List<RequirementAnalysisItem> RequirementsAnalysis,
    int ExperienceScore,
    int SkillsScore,
    int? ExtraScore,
    string Reasoning = "");
