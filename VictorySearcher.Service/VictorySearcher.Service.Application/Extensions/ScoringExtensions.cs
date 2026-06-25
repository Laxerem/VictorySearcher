using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Application.Extensions;

public static class ScoringExtensions {
    public static ScoringResult ToScoringResult(this LlmAnalysisDto analysis, Guid requestId, Guid resumeId) {
        return new ScoringResult {
            Id = Guid.NewGuid(),
            RequestId = requestId,
            ResumeId = resumeId,
            OverallScore = analysis.OverallScore,
            ExperienceScore = analysis.ExperienceScore,
            SkillsScore = analysis.SkillsScore,
            ExtraScore = analysis.ExtraScore,
            Reasoning = analysis.Reasoning,
            IsUncertain = analysis.IsUncertain,
            RequirementsAnalysis = analysis.RequirementsAnalysis
                .Select(r => new RequirementCoverage(r.Requirement, r.Covered, r.Evidence))
                .ToList(),
            ScoredAt = DateTime.UtcNow
        };
    }

    public static ScoringResultDto ToDto(this ScoringResult result) {
        return new ScoringResultDto(
            result.ResumeId,
            result.Resume.FileName,
            result.OverallScore,
            result.ExperienceScore,
            result.SkillsScore,
            result.ExtraScore,
            result.Reasoning,
            result.IsUncertain,
            result.RequirementsAnalysis
                .Select(c => new RequirementCoverageDto(c.Requirement, c.Covered, c.Evidence))
                .ToList(),
            result.ScoredAt
        );
    }
}