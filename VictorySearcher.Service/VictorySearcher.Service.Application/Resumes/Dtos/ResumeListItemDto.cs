using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Application.Resumes.Dtos;

public record ResumeListItemDto(
    Guid Id,
    string FileName,
    FileFormat Format,
    DateTime LoadedAt,
    bool IsScored);
