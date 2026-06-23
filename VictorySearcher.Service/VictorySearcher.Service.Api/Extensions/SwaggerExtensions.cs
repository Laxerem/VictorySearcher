using Microsoft.OpenApi;

namespace VictorySearcher.Service.Api.Extensions;

public static class SwaggerExtensions {
    private const string BearerScheme = "Bearer";

    public static IServiceCollection AddSwagger(this IServiceCollection services) {
        services.AddSwaggerGen(opts => {
            opts.SwaggerDoc("v1", new OpenApiInfo {
                Title = "VictorySearcher API",
                Version = "v1"
            });

            opts.AddSecurityDefinition(BearerScheme, new OpenApiSecurityScheme {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = BearerScheme,
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Введите JWT-токен. Пример: Bearer {token}"
            });

            opts.AddSecurityRequirement(_ => new OpenApiSecurityRequirement {
                {
                    new OpenApiSecuritySchemeReference(BearerScheme, null),
                    []
                }
            });
        });

        return services;
    }

    public static IApplicationBuilder UseSwaggerWithUi(this WebApplication app) {
        app.UseSwagger();
        app.UseSwaggerUI(opts => opts.SwaggerEndpoint("/swagger/v1/swagger.json", "VictorySearcher API v1"));

        return app;
    }
}
