using VictorySearcher.Service.Application.Common;

namespace VictorySearcher.Service.Application.Interfaces;

public interface IAuthService {
    Task<Result<string>> LoginAsync(string login, string password, CancellationToken ct = default);
}
