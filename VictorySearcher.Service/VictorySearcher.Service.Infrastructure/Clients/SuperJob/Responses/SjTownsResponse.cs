using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

public record SjTownsResponse(
    [property: JsonPropertyName("objects")] SjTownItem[] Objects
);
