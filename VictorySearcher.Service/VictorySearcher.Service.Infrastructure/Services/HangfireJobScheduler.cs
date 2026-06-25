using Hangfire;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Infrastructure.Jobs;

namespace VictorySearcher.Service.Infrastructure.Services;

public class HangfireJobScheduler(IBackgroundJobClient backgroundJobClient) : IScoringJobScheduler {
    public void Schedule(Guid requestId) =>
        backgroundJobClient.Enqueue<ResumeScoringJob>(job => job.ExecuteAsync(requestId, CancellationToken.None));
}
