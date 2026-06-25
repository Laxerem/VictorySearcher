using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Application.Scoring.Dtos;

public record ScoringProgressEvent(
    ScoringStatus Status,
    int Checked,
    int Total,
    string? ErrorMessage = null);
