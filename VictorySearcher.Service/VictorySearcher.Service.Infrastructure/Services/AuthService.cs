using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Infrastructure.Services;

public class AuthService(IUserRepository userRepository, IJwtProvider jwtProvider) : IAuthService {
    public async Task<Result<string>> LoginAsync(string login, string password, CancellationToken ct = default) {
        var user = await userRepository.GetByLoginAsync(login, ct);
        if (user is null) return Result<string>.Failure();
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash)) return Result<string>.Failure();
        return Result<string>.Success(jwtProvider.GenerateToken(user));
    }
}
