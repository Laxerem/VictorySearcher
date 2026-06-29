using VictorySearcher.Service.Application.Common;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter;

public interface IHhTokenProvider {
    Task<Result<string>> GetTokenAsync(CancellationToken ct = default);
}
