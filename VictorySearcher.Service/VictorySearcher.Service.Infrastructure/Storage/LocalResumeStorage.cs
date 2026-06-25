using Microsoft.Extensions.Options;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Infrastructure.Options;

namespace VictorySearcher.Service.Infrastructure.Storage;

public class LocalResumeStorage(IOptions<StorageOptions> storageOptions) : IResumeStorage {
    public async Task<string> SaveAsync(Guid vacancyId, Guid fileId, string extension, Stream content, CancellationToken ct = default) {
        var dir = Path.Combine(storageOptions.Value.UploadsPath, vacancyId.ToString());
        var filePath = Path.Combine(dir, $"{fileId}{extension}");

        Directory.CreateDirectory(dir);

        await using var fs = File.Create(filePath);
        await content.CopyToAsync(fs, ct);

        return filePath;
    }

    public void Delete(string filePath) => File.Delete(filePath);

    public Task<byte[]> ReadAllBytesAsync(string filePath, CancellationToken ct = default) =>
        File.ReadAllBytesAsync(filePath, ct);
}
