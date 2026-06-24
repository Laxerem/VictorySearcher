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
        var messages = promptBuilder.Build(options.Value.SystemPrompt, vacancy, content);
        var json = await llmClient.CompleteAsync(messages, ct);

        var data = JsonSerializer.Deserialize<LlmResponseJson>(json, JsonOpts)
            ?? throw new InvalidOperationException("LLM returned an empty or null response.");

        return new LlmAnalysisDto(
            data.OverallScore,
            data.ExperienceScore,
            data.SkillsScore,
            data.ExtraScore,
            data.Reasoning,
            data.Incongruity
        );
    }
}
