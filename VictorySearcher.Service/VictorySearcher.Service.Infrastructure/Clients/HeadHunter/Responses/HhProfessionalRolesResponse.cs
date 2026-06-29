using System.Text.Json.Serialization;

namespace VictorySearcher.Service.Infrastructure.Clients.HeadHunter.Responses;

public record HhProfessionalRolesResponse(
    [property: JsonPropertyName("categories")] HhRoleCategory[] Categories
);

public record HhRoleCategory(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("roles")] HhRole[] Roles
);

public record HhRole(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("search_deprecated")] bool SearchDeprecated
);
