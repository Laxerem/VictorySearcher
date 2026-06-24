using System.ClientModel;
using Microsoft.Extensions.Options;
using OpenAI;
using OpenAI.Chat;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Services;

public class OpenAiAnalyserLlmClient(IOptions<LlmOptions> llmOptions) : IAnalyserLlmClient {
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

        var response = await _chatClient.CompleteChatAsync(
            chatMessages,
            new ChatCompletionOptions { ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat(), Temperature = 0.2f },
            ct);

        return response.Value.Content[0].Text;
    }
}
