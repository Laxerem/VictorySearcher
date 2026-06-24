using System.Text.Json;
using Microsoft.Extensions.Options;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Infrastructure.Clients.Contracts;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Services;

public class ResumeAnalyserService(IAnalyserLlmClient llmClient, AnalyserPromptBuilder promptBuilder,
    IOptions<ResumeAnalyserOptions> options) : IResumeAnalyserService {

    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true };

    public async Task<LlmAnalysisDto> AnalyseAsync(string content, VacancyContextDto vacancy, CancellationToken ct = default) {
        var opts = options.Value;
        var messages = promptBuilder.Build(opts.SystemPrompt, vacancy, content);

        var tasks = Enumerable.Range(0, opts.Runs)
            .Select(async i => {
                if (i > 0)
                    await Task.Delay(i * opts.RunDelayMs, ct);

                var json = await llmClient.CompleteAsync(messages, ct);
                return JsonSerializer.Deserialize<LlmResponseJson>(json, JsonOpts)
                       ?? throw new InvalidOperationException("LLM returned null.");
            });

        var runs = await Task.WhenAll(tasks);

        var expScores = runs.Select(r => r.ExperienceScore).ToArray();
        var experienceScore = Median(expScores);
        var skillsScore = Median(runs.Select(r => r.SkillsScore));
        var extraScore = MedianNullable(runs.Select(r => r.ExtraScore));
        var incongruity = runs.Count(r => r.Incongruity) > runs.Length / 2;
        var reasoning = runs[^1].Reasoning;

        var overallScore = (int)Math.Round(
            experienceScore * opts.ExperienceWeight +
            skillsScore * opts.SkillsWeight +
            (extraScore ?? skillsScore) * opts.ExtraWeight);

        var spread = expScores.Max() - expScores.Min();
        var isUncertain = spread > opts.UncertaintySpreadThreshold;

        var analysis = runs[^1].RequirementsAnalysis
            .Select(r => new RequirementCoverageDto(r.Requirement, r.Covered, r.Evidence))
            .ToList();

        return new LlmAnalysisDto(overallScore, experienceScore, skillsScore, extraScore,
            reasoning, incongruity, isUncertain, analysis);
    }

    private static int Median(IEnumerable<int> values) {
        var sorted = values.Order().ToArray();
        return sorted[sorted.Length / 2];
    }

    private static int? MedianNullable(IEnumerable<int?> values) {
        var arr = values.Where(v => v.HasValue).Select(v => v!.Value).Order().ToArray();
        return arr.Length == 0 ? null : arr[arr.Length / 2];
    }
}
