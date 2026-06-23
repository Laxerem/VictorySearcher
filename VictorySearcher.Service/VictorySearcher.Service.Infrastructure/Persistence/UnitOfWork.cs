using VictorySearcher.Service.Domain.Repositories;

namespace VictorySearcher.Service.Infrastructure.Persistence;

public class UnitOfWork(AppDbContext db) : IUnitOfWork {
    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => db.SaveChangesAsync(ct);
}
