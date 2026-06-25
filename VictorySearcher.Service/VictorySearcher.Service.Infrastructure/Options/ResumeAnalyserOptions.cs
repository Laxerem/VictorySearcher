namespace VictorySearcher.Service.Infrastructure.Options;

public class ResumeAnalyserOptions {
    public string SystemPrompt { get; set; } = string.Empty;
    public float ExperienceWeight { get; set; } = 0.50f;
    public float SkillsWeight { get; set; } = 0.35f;
    public float ExtraWeight { get; set; } = 0.15f;
    public int Runs { get; set; } = 3;
    public int RunDelayMs { get; set; } = 500;
    public int UncertaintySpreadThreshold { get; set; } = 15;
}
