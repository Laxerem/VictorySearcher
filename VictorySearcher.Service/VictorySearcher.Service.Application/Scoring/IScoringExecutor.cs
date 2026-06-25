namespace VictorySearcher.Service.Application.Scoring;

public interface IScoringExecutor {
    Task ExecuteAsync(Guid requestId, CancellationToken ct = default);
}
