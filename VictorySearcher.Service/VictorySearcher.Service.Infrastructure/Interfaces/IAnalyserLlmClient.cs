namespace VictorySearcher.Service.Infrastructure;

public interface IAnalyserLlmClient {
    Task<string> CompleteAsync(IReadOnlyList<LlmMessage> messages, CancellationToken ct = default);
}

public record LlmMessage(LlmMessageRole Role, string Content);

public enum LlmMessageRole { System, User }
