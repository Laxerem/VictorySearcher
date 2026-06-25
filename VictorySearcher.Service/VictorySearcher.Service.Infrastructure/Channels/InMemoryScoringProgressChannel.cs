using System.Collections.Concurrent;
using System.Threading.Channels;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Infrastructure.Channels;

public sealed class InMemoryScoringProgressChannel : IScoringProgressChannel {
    private readonly ConcurrentDictionary<Guid, Channel<ScoringProgressEvent>> _channels = new();

    public void Create(Guid requestId) {
        var ch = Channel.CreateBounded<ScoringProgressEvent>(
            new BoundedChannelOptions(1024) {
                FullMode = BoundedChannelFullMode.DropWrite,
                SingleReader = true,
                SingleWriter = true
            });
        _channels[requestId] = ch;
    }

    public bool TryWrite(Guid requestId, ScoringProgressEvent evt) =>
        _channels.TryGetValue(requestId, out var ch) && ch.Writer.TryWrite(evt);

    public void Complete(Guid requestId) {
        if (_channels.TryRemove(requestId, out var ch))
            ch.Writer.TryComplete();
    }

    public IAsyncEnumerable<ScoringProgressEvent>? TryGetReader(Guid requestId) =>
        _channels.TryGetValue(requestId, out var ch) ? ch.Reader.ReadAllAsync() : null;
}
