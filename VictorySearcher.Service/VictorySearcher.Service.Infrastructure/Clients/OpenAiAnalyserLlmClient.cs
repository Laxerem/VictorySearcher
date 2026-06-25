using System.ClientModel;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Services;

public class OpenAiAnalyserLlmClient(IOptions<LlmOptions> llmOptions, ILogger<OpenAiAnalyserLlmClient> logger) : IAnalyserLlmClient {
    private readonly LlmOptions _opts = llmOptions.Value;
    private readonly ChatClient _chatClient = new OpenAIClient(
            new ApiKeyCredential(llmOptions.Value.ApiKey),
            new OpenAIClientOptions { Endpoint = new Uri(llmOptions.Value.BaseUrl) })
        .GetChatClient(llmOptions.Value.ModelId);

    public async Task<string> CompleteAsync(IReadOnlyList<LlmMessage> messages, CancellationToken ct = default) {
        var chatMessages = messages.Select<LlmMessage, ChatMessage>(m => m.Role switch {
            LlmMessageRole.System => ChatMessage.CreateSystemMessage(m.Content),
            LlmMessageRole.User => ChatMessage.CreateUserMessage(m.Content),
            _ => throw new ArgumentOutOfRangeException(nameof(m.Role), m.Role, null)
        }).ToList();

        var sw = Stopwatch.StartNew();

        var response = await _chatClient.CompleteChatAsync(
            chatMessages,
            new ChatCompletionOptions { ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat(), Temperature = 0.2f },
            ct);

        sw.Stop();

        var usage = response.Value.Usage;
        logger.LogInformation(
            "LLM {Model} responded in {ElapsedMs}ms — tokens: {InputTokens} in / {OutputTokens} out",
            _opts.ModelId, sw.ElapsedMilliseconds, usage.InputTokenCount, usage.OutputTokenCount);

        return response.Value.Content[0].Text;
    }
}
