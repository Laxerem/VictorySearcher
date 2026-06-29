using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhDictionariesResponse(
    [property: JsonPropertyName("experience")] HhLookup[] Experience,
    [property: JsonPropertyName("employment")] HhLookup[] Employment,
    [property: JsonPropertyName("schedule")] HhLookup[] Schedule,
    [property: JsonPropertyName("currency")] HhCurrency[] Currency
);

public record HhCurrency(
    [property: JsonPropertyName("code")] string Code,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("rate")] decimal Rate
);
