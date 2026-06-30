using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Domain.Entities;

public class Resume {
    public Guid Id { get; set; }
    public Guid VacancyId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public FileFormat Format { get; set; }
    public long FileSizeBytes { get; set; }
    public DateTime LoadedAt { get; set; }

    public Vacancy Vacancy { get; set; } = null!;
    public ICollection<ScoringResult> ScoringResults { get; set; } = [];
}