using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhVacancyDetail(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("salary")] HhSalary? Salary,
    [property: JsonPropertyName("experience")] HhLookup? Experience,
    [property: JsonPropertyName("employment")] HhLookup? Employment,
    [property: JsonPropertyName("schedule")] HhLookup? Schedule,
    [property: JsonPropertyName("employer")] HhEmployerRef Employer,
    [property: JsonPropertyName("published_at")] string PublishedAt,
    [property: JsonPropertyName("key_skills")] HhSkill[] KeySkills,
    [property: JsonPropertyName("description")] string? Description
);
