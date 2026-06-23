using VictorySearcher.Service.Application.Interfaces;

namespace VictorySearcher.Service.Infrastructure.Persistence;

public class UnitOfWork(AppDbContext db) : IUnitOfWork {
    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => db.SaveChangesAsync(ct);
}
