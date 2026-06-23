using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Persistence;

public static class AppDbContextSeed {
    public static async Task SeedAsync(AppDbContext db, JwtOptions opts, CancellationToken ct = default) {
        if (await db.Users.AnyAsync(ct))
            return;

        db.Users.Add(new User {
            Id = Guid.NewGuid(),
            Login = opts.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(opts.Password)
        });

        await db.SaveChangesAsync(ct);
    }
}
