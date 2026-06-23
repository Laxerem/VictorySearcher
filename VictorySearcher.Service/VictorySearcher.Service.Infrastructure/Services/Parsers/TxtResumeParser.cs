using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Infrastructure.Services.Parsers;

public class TxtResumeParser : IResumeParser {
    public FileFormat SupportedFormat => FileFormat.TXT;

    public Task<string> ParseAsync(Resume resume, CancellationToken ct = default) =>
        File.ReadAllTextAsync(resume.FilePath, ct);
}
