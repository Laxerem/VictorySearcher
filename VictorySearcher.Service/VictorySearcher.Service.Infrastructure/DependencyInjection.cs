using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Domain.Repositories;
using VictorySearcher.Service.Infrastructure.Channels;
using VictorySearcher.Service.Infrastructure.Jobs;
using VictorySearcher.Service.Infrastructure.Options;
using VictorySearcher.Service.Infrastructure.Persistence;
using VictorySearcher.Service.Infrastructure.Repositories;
using VictorySearcher.Service.Infrastructure.Services;
using VictorySearcher.Service.Infrastructure.Services.Parsers;
using VictorySearcher.Service.Infrastructure.Storage;

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
        services.Configure<ResumeAnalyserOptions>(configuration.GetSection("ResumeAnalyser"));
        services.Configure<StorageOptions>(configuration.GetSection("Storage"));

        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<IPasswordVerifier, BcryptPasswordVerifier>();
        services.AddScoped<IScoringJobScheduler, HangfireJobScheduler>();
        services.AddScoped<IResumeStorage, LocalResumeStorage>();

        services.AddScoped<IResumeParser, TxtResumeParser>();
        services.AddScoped<IResumeParser, DocxResumeParser>();
        services.AddScoped<IResumeParser, PdfResumeParser>();

        services.AddSingleton<IScoringProgressChannel, InMemoryScoringProgressChannel>();
        services.AddSingleton<IAnalyserLlmClient, OpenAiAnalyserLlmClient>();
        services.AddSingleton<AnalyserPromptBuilder>();
        services.AddScoped<IResumeAnalyserService, ResumeAnalyserService>();
        services.AddTransient<ResumeScoringJob>();

        services.AddHangfire(cfg => cfg
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(c => c.UseNpgsqlConnection(
                configuration.GetConnectionString("Postgres")!)));

        services.AddHangfireServer();

        return services;
    }
}
