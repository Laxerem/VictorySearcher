using VictorySearcher.Service.Domain.Enums;

namespace VictorySearcher.Service.Application.Scoring.Dtos;

public record ScoringStatusDto(
    ScoringStatus Status,
    string? ErrorMessage,
    DateTime CreatedAt,
    DateTime? FinishedAt);
