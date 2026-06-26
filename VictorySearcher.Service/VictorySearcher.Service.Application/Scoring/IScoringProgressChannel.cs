using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Application.Scoring;

public interface IScoringProgressChannel {
    void Create(Guid requestId);
    bool TryWrite(Guid requestId, ScoringProgressEvent evt);
    void Complete(Guid requestId);
    IAsyncEnumerable<ScoringProgressEvent>? TryGetReader(Guid requestId);
    ScoringProgressEvent? TryGetLastEvent(Guid requestId);
    bool HasPendingEvents(Guid requestId);
}
