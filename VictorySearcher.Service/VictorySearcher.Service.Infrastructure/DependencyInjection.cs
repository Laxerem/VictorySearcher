using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Options;
using VictorySearcher.Service.Infrastructure.Persistence;
using VictorySearcher.Service.Infrastructure.Repositories;

namespace VictorySearcher.Service.Infrastructure;

public static class DependencyInjection {
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration) {
        services.AddDbContext<AppDbContext>(opts =>
            opts.UseNpgsql(configuration.GetConnectionString("Postgres")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IVacancyRepository, VacancyRepository>();
        services.AddScoped<IResumeRepository, ResumeRepository>();
        services.AddScoped<IScoringRequestRepository, ScoringRequestRepository>();
        services.AddScoped<IScoringResultRepository, ScoringResultRepository>();

        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        services.Configure<LlmOptions>(configuration.GetSection("Llm"));
        services.Configure<StorageOptions>(configuration.GetSection("Storage"));

        return services;
    }
}
