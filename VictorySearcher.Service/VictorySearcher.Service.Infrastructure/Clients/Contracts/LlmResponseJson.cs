namespace VictorySearcher.Service.Infrastructure.Clients.Contracts;

public record LlmResponseJson (
    int OverallScore,
    int ExperienceScore,
    int SkillsScore,
    int? ExtraScore,
    bool Incongruity,
    string Reasoning = ""
);