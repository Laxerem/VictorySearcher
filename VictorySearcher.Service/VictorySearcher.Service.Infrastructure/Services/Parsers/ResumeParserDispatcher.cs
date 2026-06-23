using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Infrastructure.Services.Parsers;

public class ResumeParserDispatcher {
    private readonly Dictionary<FileFormat, IResumeParser> _parsers;

    public ResumeParserDispatcher(IEnumerable<IResumeParser> parsers) {
        _parsers = parsers.ToDictionary(p => p.SupportedFormat);
    }

    public Task<string> ParseAsync(Resume resume, CancellationToken ct = default) {
        if (!_parsers.TryGetValue(resume.Format, out var parser))
            throw new NotSupportedException($"File format '{resume.Format}' is not supported for resume parsing.");

        return parser.ParseAsync(resume, ct);
    }
}
