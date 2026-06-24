using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Domain.Repositories;

public interface IResumeRepository {
    Task<Resume?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Resume>> GetByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default);
    Task AddAsync(Resume resume, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<Resume> resumes, CancellationToken ct = default);

    Task<IReadOnlyList<Resume>> GetPagedByVacancyIdAsync(
        Guid vacancyId, int page, int pageSize, CancellationToken ct = default);

    Task<int> GetCountByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default);
    Task<int> GetScoredCountByVacancyIdAsync(Guid vacancyId, CancellationToken ct = default);

    Task<IReadOnlyList<Resume>> GetUnscoredByVacancyIdAsync(
        Guid vacancyId, CancellationToken ct = default);
}
