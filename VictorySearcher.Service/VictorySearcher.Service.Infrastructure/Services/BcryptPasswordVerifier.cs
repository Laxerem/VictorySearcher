using VictorySearcher.Service.Application.Interfaces;

namespace VictorySearcher.Service.Infrastructure.Services;

public class BcryptPasswordVerifier : IPasswordVerifier {
    public bool Verify(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
}
