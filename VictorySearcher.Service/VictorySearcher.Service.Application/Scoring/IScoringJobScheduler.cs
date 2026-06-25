namespace VictorySearcher.Service.Application.Scoring;

public interface IScoringJobScheduler {
    void Schedule(Guid requestId);
}
