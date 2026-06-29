using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

public record SjLookup(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("title")] string Title
);
