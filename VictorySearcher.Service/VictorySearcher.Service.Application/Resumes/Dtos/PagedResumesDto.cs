namespace VictorySearcher.Service.Application.Resumes.Dtos;

public record PagedResumesDto(
    int TotalCount,
    int Page,
    int PageSize,
    int ScoredCount,
    int UnscoredCount,
    IReadOnlyList<ResumeListItemDto> Items);
