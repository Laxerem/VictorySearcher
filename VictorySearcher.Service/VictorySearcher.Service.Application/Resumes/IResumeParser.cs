using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Application.Resumes;

public interface IResumeParser {
    FileFormat SupportedFormat { get; }
    Task<string> ParseAsync(Resume resume, CancellationToken ct = default);
}
