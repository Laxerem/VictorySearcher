using VictorySearcher.Service.Application.Common;
using VictorySearcher.Service.Application.Resumes.Dtos;

namespace VictorySearcher.Service.Application.Resumes;

public interface IResumeService {
    Task<Result<Guid>> UploadAsync(
        Guid vacancyId,
        string fileName,
        long fileSizeBytes,
        Stream content,
        CancellationToken ct = default);

    Task<Result<PagedResumesDto>> GetPagedAsync(
        Guid vacancyId, int page, int pageSize, CancellationToken ct = default);

    Task<Result<ResumeContentDto>> GetContentAsync(
        Guid vacancyId, Guid resumeId, CancellationToken ct = default);

    Task<Result<ResumeFileDto>> GetFileAsync(
        Guid vacancyId, Guid resumeId, CancellationToken ct = default);
}
