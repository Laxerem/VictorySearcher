namespace VictorySearcher.Service.Infrastructure.Clients.Llm.Responses;

public record LlmResponseJson(
    List<RequirementAnalysisItem> RequirementsAnalysis,
    int ExperienceScore,
    int SkillsScore,
    int? ExtraScore,
    string Reasoning = "");
