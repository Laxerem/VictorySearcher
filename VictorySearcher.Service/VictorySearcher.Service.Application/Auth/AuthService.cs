using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Application.Auth;

public class AuthService(IUserRepository userRepository, IJwtProvider jwtProvider, IPasswordVerifier passwordVerifier) : IAuthService {
    public async Task<Result<string>> LoginAsync(string login, string password, CancellationToken ct = default) {
        var user = await userRepository.GetByLoginAsync(login, ct);
        if (user is null) return Result<string>.Failure(AppError.Unauthorized());
        if (!passwordVerifier.Verify(password, user.PasswordHash)) return Result<string>.Failure(AppError.Unauthorized());
        return Result<string>.Success(jwtProvider.GenerateToken(user));
    }
}
