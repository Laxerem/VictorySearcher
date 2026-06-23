using System.ClientModel;
using System.Text.Json;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Services;

public class ResumeAnalyserService(IOptions<LlmOptions> llmOptions) : IResumeAnalyserService {
    private static readonly JsonSerializerOptions JsonOpts = new() { PropertyNameCaseInsensitive = true };

    public async Task<LlmAnalysisDto> AnalyseAsync(string content, VacancyContextDto vacancy, CancellationToken ct = default) {
        var opts = llmOptions.Value;
        var client = new OpenAIClient(
            new ApiKeyCredential(opts.ApiKey),
            new OpenAIClientOptions { Endpoint = new Uri(opts.BaseUrl) });

        var chatClient = client.GetChatClient(opts.ModelId);

        // TODO: prompt engineering — replace placeholders with actual scoring instructions
        var messages = new ChatMessage[] {
            ChatMessage.CreateSystemMessage(
                "You are a resume scoring assistant. Analyse the resume against the vacancy and return a JSON object " +
                "with fields: overallScore (0-100), experienceScore (0-100), skillsScore (0-100), " +
                "extraScore (0-100 or null if no extra requirements), reasoning (string), incongruity (bool)."),
            ChatMessage.CreateUserMessage(
                $"Vacancy: {vacancy.Title}\n\nDescription: {vacancy.Description}\n\n" +
                $"Requirements: {vacancy.Requirements}\n\n" +
                (vacancy.ExtraRequirements is not null ? $"Extra requirements: {vacancy.ExtraRequirements}\n\n" : "") +
                $"Resume:\n{content}")
        };

        var response = await chatClient.CompleteChatAsync(
            messages,
            new ChatCompletionOptions { ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat() },
            ct);

        var json = response.Value.Content[0].Text;

        var data = JsonSerializer.Deserialize<LlmResponseJson>(json, JsonOpts)
            ?? throw new InvalidOperationException("LLM returned an empty or null response.");

        return new LlmAnalysisDto(
            data.OverallScore,
            data.ExperienceScore,
            data.SkillsScore,
            data.ExtraScore,
            data.Reasoning,
            data.Incongruity);
    }

    private sealed class LlmResponseJson {
        public int OverallScore { get; set; }
        public int ExperienceScore { get; set; }
        public int SkillsScore { get; set; }
        public int? ExtraScore { get; set; }
        public string Reasoning { get; set; } = string.Empty;
        public bool Incongruity { get; set; }
    }
}
