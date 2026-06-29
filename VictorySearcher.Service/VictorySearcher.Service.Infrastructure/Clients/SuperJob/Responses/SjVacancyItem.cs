using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.SuperJob.Responses;

public record SjVacancyItem(
    [property: JsonPropertyName("id")] int Id,
    [property: JsonPropertyName("profession")] string Profession,
    [property: JsonPropertyName("payment_from")] int PaymentFrom,
    [property: JsonPropertyName("payment_to")] int PaymentTo,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("firm_name")] string FirmName,
    [property: JsonPropertyName("firm_id")] string FirmId,
    [property: JsonPropertyName("town")] SjLookup Town,
    [property: JsonPropertyName("experience")] SjLookup Experience,
    [property: JsonPropertyName("type_of_work")] SjLookup TypeOfWork,
    [property: JsonPropertyName("place_of_work")] SjLookup PlaceOfWork,
    [property: JsonPropertyName("candidat")] string? Candidat,
    [property: JsonPropertyName("link")] string? Link,
    [property: JsonPropertyName("date_published")] long DatePublished
);
