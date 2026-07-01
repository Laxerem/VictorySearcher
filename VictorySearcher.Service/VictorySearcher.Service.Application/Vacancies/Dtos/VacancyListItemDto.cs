using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Application.Vacancies.Dtos;

public record VacancyItemDto(
    Guid Id,
    string Title,
    string? Trend,
    [property: JsonPropertyName("resume_count")]
    int ResumeCount,
    [property: JsonPropertyName("checked_resume_count")]
    int CheckedResumeCount,
    [property: JsonPropertyName("best_score")]
    int BestScore
);
public record VacancyListItemDto(
    int Total,
    [property: JsonPropertyName("total_resumes")]
    int TotalResumes,
    IReadOnlyList<VacancyItemDto> Items
);
