namespace VictorySearcher.Service.Domain.Entities;

public class ScoringResult {
    public Guid Id { get; set; }
    public Guid RequestId { get; set; }
    public Guid ResumeId { get; set; }
    public bool Incongruity { get; set; }
    public int OverallScore { get; set; }
    public int ExperienceScore { get; set; }
    public int SkillsScore { get; set; }
    public int? ExtraScore { get; set; }
    public string Reasoning { get; set; } = string.Empty;
    public bool IsUncertain { get; set; }
    public List<RequirementCoverage> RequirementsAnalysis { get; set; } = [];
    public DateTime ScoredAt { get; set; }

    public ScoringRequest Request { get; set; } = null!;
    public Resume Resume { get; set; } = null!;
}
