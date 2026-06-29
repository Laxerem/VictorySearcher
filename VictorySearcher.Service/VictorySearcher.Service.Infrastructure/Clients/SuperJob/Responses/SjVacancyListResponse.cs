using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

public record SjVacancyListResponse(
    [property: JsonPropertyName("total")] int Total,
    [property: JsonPropertyName("more")] bool More,
    [property: JsonPropertyName("objects")] SjVacancyItem[] Objects
);
