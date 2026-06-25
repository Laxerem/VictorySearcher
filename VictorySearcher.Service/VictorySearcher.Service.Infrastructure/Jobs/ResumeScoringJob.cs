using VictorySearcher.Service.Application.Scoring;

namespace VictorySearcher.Service.Infrastructure.Jobs;

public class ResumeScoringJob(IScoringExecutor executor) {
    public Task ExecuteAsync(Guid requestId, CancellationToken ct = default) =>
        executor.ExecuteAsync(requestId, ct);
}
