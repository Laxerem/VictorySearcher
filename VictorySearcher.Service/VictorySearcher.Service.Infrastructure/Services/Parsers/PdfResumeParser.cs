using System.Text;
using UglyToad.PdfPig;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Infrastructure.Services.Parsers;

public class PdfResumeParser : IResumeParser {
    public FileFormat SupportedFormat => FileFormat.PDF;

    public Task<string> ParseAsync(Resume resume, CancellationToken ct = default) {
        using var doc = PdfDocument.Open(resume.FilePath);
        var sb = new StringBuilder();
        foreach (var page in doc.GetPages()) {
            foreach (var word in page.GetWords())
                sb.Append(word.Text).Append(' ');
            sb.AppendLine();
        }
        return Task.FromResult(sb.ToString().Trim());
    }
}
