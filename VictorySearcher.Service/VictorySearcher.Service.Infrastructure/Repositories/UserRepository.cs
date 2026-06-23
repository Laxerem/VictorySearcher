using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Persistence;

namespace VictorySearcher.Service.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository {
    public Task<User?> GetByLoginAsync(string login, CancellationToken ct = default)
        => db.Users.FirstOrDefaultAsync(u => u.Login == login, ct);

    public Task<bool> AnyAsync(CancellationToken ct = default)
        => db.Users.AnyAsync(ct);

    public Task AddAsync(User user, CancellationToken ct = default) {
        db.Users.Add(user);
        return Task.CompletedTask;
    }
}
