using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Domain.Entities;

public class ScoringRequest {
    public Guid Id { get; set; }
    public Guid VacancyId { get; set; }
    public ScoringStatus Status { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? FinishedAt { get; set; }

    public Vacancy Vacancy { get; set; } = null!;
    public ICollection<ScoringResult> Results { get; set; } = [];
}
