namespace VictorySearcher.Service.Application.Resumes.Dtos;

public record PagedResumesDto(
    IReadOnlyList<ResumeListItemDto> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int ScoredCount,
    int UnscoredCount);
