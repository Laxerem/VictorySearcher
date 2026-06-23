using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Domain.Repositories;

public interface IResumeRepository
{
    Task<Resume?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Resume>> GetByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<Resume> resumes, CancellationToken ct = default);
}
