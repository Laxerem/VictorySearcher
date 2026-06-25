using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Domain.Entities;
using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Infrastructure.Services.Parsers;

public class DocxResumeParser : IResumeParser {
    public FileFormat SupportedFormat => FileFormat.DOCX;

    public Task<string> ParseAsync(Resume resume, CancellationToken ct = default) {
        using var doc = WordprocessingDocument.Open(resume.FilePath, false);
        var body = doc.MainDocumentPart!.Document.Body!;
        var paragraphs = body.Descendants<Paragraph>()
            .Select(p => string.Concat(p.Descendants<Text>().Select(t => t.Text)));
        var text = string.Join(Environment.NewLine,
            paragraphs.Where(p => !string.IsNullOrWhiteSpace(p)));
        return Task.FromResult(text);
    }
}
