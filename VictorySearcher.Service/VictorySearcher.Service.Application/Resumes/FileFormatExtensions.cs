using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Application.Resumes;

public static class FileFormatExtensions {
    public static string ToFileExtension(this FileFormat format) =>
        $".{format.ToString().ToLowerInvariant()}";

    public static FileFormat? FromFileExtension(string extension) {
        var normalized = extension.ToLowerInvariant();
        foreach (var format in Enum.GetValues<FileFormat>()) {
            if (format.ToFileExtension() == normalized)
                return format;
        }
        return null;
    }

    public static IReadOnlyList<string> AllExtensions() =>
        Enum.GetValues<FileFormat>()
            .Select(f => f.ToFileExtension())
            .ToArray();
}
