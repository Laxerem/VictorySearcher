namespace VictorySearcher.Service.Application.Resumes;

public interface IResumeStorage {
    Task<string> SaveAsync(Guid vacancyId, Guid fileId, string extension, Stream content, CancellationToken ct = default);
    void Delete(string filePath);
    Task<byte[]> ReadAllBytesAsync(string filePath, CancellationToken ct = default);
}
