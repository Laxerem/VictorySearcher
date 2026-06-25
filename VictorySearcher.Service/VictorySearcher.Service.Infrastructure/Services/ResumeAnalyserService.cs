using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Infrastructure.Clients.Contracts;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Services;

public class ResumeAnalyserService(IAnalyserLlmClient llmClient, AnalyserPromptBuilder promptBuilder,
    IOptions<ResumeAnalyserOptions> options, ILogger<ResumeAnalyserService> logger) : IResumeAnalyserService {

    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true };

    public async Task<LlmAnalysisDto> AnalyseAsync(string content, VacancyContextDto vacancy, CancellationToken ct = default) {
        var opts = options.Value;
        var messages = promptBuilder.Build(opts.SystemPrompt, vacancy, content);

        var runs = await RunLlmCallsAsync(messages, opts, ct);
        if (runs.Length == 0)
            throw new InvalidOperationException("All LLM runs failed.");

        return AggregateResults(runs, opts);
    }

    private async Task<LlmResponseJson[]> RunLlmCallsAsync(IReadOnlyList<LlmMessage> messages, ResumeAnalyserOptions opts, CancellationToken ct) {
        var tasks = Enumerable.Range(0, opts.Runs)
            .Select(async i => {
                if (i > 0)
                    await Task.Delay(i * opts.RunDelayMs, ct);
                try {
                    var json = await llmClient.CompleteAsync(messages, ct);
                    var result = JsonSerializer.Deserialize<LlmResponseJson>(json, JsonOpts)
                                 ?? throw new InvalidOperationException("LLM returned null.");
                    var clamped = result with {
                        ExperienceScore = Math.Clamp(result.ExperienceScore, 0, 100),
                        SkillsScore = Math.Clamp(result.SkillsScore, 0, 100),
                        ExtraScore = result.ExtraScore.HasValue
                            ? Math.Clamp(result.ExtraScore.Value, 0, 100)
                            : (int?)null,
                    };
                    logger.LogInformation(
                        "LLM run {Run}/{Total}: experience={Experience}, skills={Skills}, extra={Extra}. {Reasoning}",
                        i + 1, opts.Runs, clamped.ExperienceScore, clamped.SkillsScore, clamped.ExtraScore, clamped.Reasoning);
                    return clamped;
                } catch (Exception ex) {
                    logger.LogWarning(ex, "LLM run {Run}/{Total} failed", i + 1, opts.Runs);
                    return null;
                }
            });

        var allResults = await Task.WhenAll(tasks);
        var runs = allResults.Where(r => r is not null).Select(r => r!).ToArray();

        if (runs.Length < opts.Runs)
            logger.LogWarning("Only {Succeeded}/{Total} LLM runs succeeded", runs.Length, opts.Runs);

        return runs;
    }

    private LlmAnalysisDto AggregateResults(LlmResponseJson[] runs, ResumeAnalyserOptions opts) {
        var degraded = runs.Length < opts.Runs;

        var perRunOveralls = runs
            .Select(r => (int)Math.Round(
                r.ExperienceScore * opts.ExperienceWeight +
                r.SkillsScore * opts.SkillsWeight +
                (r.ExtraScore ?? r.SkillsScore) * opts.ExtraWeight))
            .ToArray();

        var overallScore = Median(perRunOveralls);
        var experienceScore = Median(runs.Select(r => r.ExperienceScore));
        var skillsScore = Median(runs.Select(r => r.SkillsScore));
        var extraScore = MedianNullable(runs.Select(r => r.ExtraScore));

        var spread = perRunOveralls.Max() - perRunOveralls.Min();
        var isUncertain = degraded || spread > opts.UncertaintySpreadThreshold;

        var bestRun = runs
            .Select((r, i) => (run: r, overall: perRunOveralls[i]))
            .OrderBy(x => Math.Abs(x.overall - overallScore))
            .First()
            .run;

        var analysis = bestRun.RequirementsAnalysis
            .Select(r => new RequirementCoverageDto(r.Requirement, r.Covered, r.Evidence))
            .ToList();

        return new LlmAnalysisDto(overallScore, experienceScore, skillsScore, extraScore,
            bestRun.Reasoning, isUncertain, analysis);
    }

    private int Median(IEnumerable<int> values) {
        var sorted = values.Order().ToArray();
        return sorted[sorted.Length / 2];
    }

    private int? MedianNullable(IEnumerable<int?> values) {
        var arr = values.Where(v => v.HasValue).Select(v => v!.Value).Order().ToArray();
        return arr.Length == 0 ? null : arr[arr.Length / 2];
    }
}
