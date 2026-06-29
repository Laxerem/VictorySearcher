using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhVacancyListResponse(
    [property: JsonPropertyName("found")] int Found,
    [property: JsonPropertyName("pages")] int Pages,
    [property: JsonPropertyName("per_page")] int PerPage,
    [property: JsonPropertyName("page")] int Page,
    [property: JsonPropertyName("items")] HhVacancyItem[] Items
);
