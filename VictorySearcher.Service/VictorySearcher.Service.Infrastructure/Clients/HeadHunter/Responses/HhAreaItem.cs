using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhAreaItem(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("parent_id")] string? ParentId,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("areas")] HhAreaItem[] Areas
);
