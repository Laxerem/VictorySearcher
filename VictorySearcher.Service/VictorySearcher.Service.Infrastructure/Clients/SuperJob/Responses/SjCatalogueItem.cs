using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

public record SjCatalogueItem(
    [property: JsonPropertyName("key")] int Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("positions")] SjCataloguePosition[] Positions
);

public record SjCataloguePosition(
    [property: JsonPropertyName("key")] int Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("id_parent")] int IdParent
);
