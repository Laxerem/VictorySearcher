using Microsoft.Extensions.DependencyInjection;
using VictorySearcher.Service.Application.Auth;
using VictorySearcher.Service.Application.Interfaces;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Vacancies;

namespace VictorySearcher.Service.Application;

public static class DependencyInjection {
    public static IServiceCollection AddApplication(this IServiceCollection services) {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IVacancyService, VacancyService>();
        services.AddScoped<IResumeService, ResumeService>();
        services.AddScoped<IScoringService, ScoringService>();
        services.AddScoped<IScoringExecutor, ScoringExecutor>();
        services.AddScoped<ResumeParserDispatcher>();

        return services;
    }
}
