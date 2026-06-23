namespace VictorySearcher.Service.Domain.Entities;

public class Vacancy
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Requirements { get; set; } = string.Empty;
    public string? ExtraRequirements { get; set; }
    public Guid CreatedById { get; set; }
    public DateTime CreatedAt { get; set; }

    public User CreatedBy { get; set; } = null!;
    public ICollection<Resume> Resumes { get; set; } = [];
    public ICollection<ScoringRequest> ScoringRequests { get; set; } = [];
}
