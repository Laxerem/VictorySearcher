using System.Collections.Concurrent;
using System.Threading.Channels;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Infrastructure.Channels;

public sealed class InMemoryScoringProgressChannel : IScoringProgressChannel {
    private readonly ConcurrentDictionary<Guid, Channel<ScoringProgressEvent>> _channels = new();
    private readonly ConcurrentDictionary<Guid, ScoringProgressEvent> _lastEvents = new();

    public void Create(Guid requestId) {
        var ch = Channel.CreateBounded<ScoringProgressEvent>(
            new BoundedChannelOptions(1024) {
                FullMode = BoundedChannelFullMode.DropWrite,
                SingleReader = true,
                SingleWriter = true
            });
        _channels[requestId] = ch;
    }

    public bool TryWrite(Guid requestId, ScoringProgressEvent evt) {
        if (!_channels.TryGetValue(requestId, out var ch) || !ch.Writer.TryWrite(evt))
            return false;
        _lastEvents[requestId] = evt;
        return true;
    }

    public void Complete(Guid requestId) {
        if (_channels.TryRemove(requestId, out var ch))
            ch.Writer.TryComplete();
        _lastEvents.TryRemove(requestId, out _);
    }

    public IAsyncEnumerable<ScoringProgressEvent>? TryGetReader(Guid requestId) =>
        _channels.TryGetValue(requestId, out var ch) ? ch.Reader.ReadAllAsync() : null;

    public ScoringProgressEvent? TryGetLastEvent(Guid requestId) =>
        _lastEvents.TryGetValue(requestId, out var evt) ? evt : null;

    public bool HasPendingEvents(Guid requestId) =>
        _channels.TryGetValue(requestId, out var ch) && ch.Reader.Count > 0;
}
