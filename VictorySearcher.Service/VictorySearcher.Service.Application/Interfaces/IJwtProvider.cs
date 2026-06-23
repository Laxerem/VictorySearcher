using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Application.Interfaces;

public interface IJwtProvider {
    string GenerateToken(User user);
}
