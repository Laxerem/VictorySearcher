namespace VictorySearcher.Service.Application.Scoring.Dtos;

public record ScoringResultDto(
    Guid ResumeId,
    string FileName,
    int OverallScore,
    int ExperienceScore,
    int SkillsScore,
    int? ExtraScore,
    string Reasoning,
    bool Incongruity,
    DateTime ScoredAt);
