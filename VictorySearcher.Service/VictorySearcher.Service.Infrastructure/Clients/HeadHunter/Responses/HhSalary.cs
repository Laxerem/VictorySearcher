using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhSalary(
    [property: JsonPropertyName("from")] int? From,
    [property: JsonPropertyName("to")] int? To,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("gross")] bool Gross
);
