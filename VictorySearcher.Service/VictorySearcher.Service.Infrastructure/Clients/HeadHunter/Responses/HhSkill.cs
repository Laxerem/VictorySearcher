using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhSkill(
    [property: JsonPropertyName("name")] string Name
);
