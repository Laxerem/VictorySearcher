using VictorySearcher.Service.Application.Common;

namespace VictorySearcher.Service.Application.Resumes;

public interface IResumeService {
    Task<Result<Guid>> UploadAsync(
        Guid vacancyId,
        string fileName,
        Stream content,
        CancellationToken ct = default);
}
