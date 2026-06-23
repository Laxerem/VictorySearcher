namespace VictorySearcher.Service.Domain.Repositories;

public interface IUnitOfWork {
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
