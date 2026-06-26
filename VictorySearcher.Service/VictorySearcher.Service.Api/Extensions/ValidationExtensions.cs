using FluentValidation;
using FluentValidation.AspNetCore;
using VictorySearcher.Service.Api.Options;
using VictorySearcher.Service.Api.Validators;

namespace VictorySearcher.Service.Api.Extensions;

public static class ValidationExtensions {
    public static IServiceCollection AddValidation(this IServiceCollection services, IConfiguration configuration) {
        services.Configure<ResumeUploadOptions>(configuration.GetSection("ResumeUpload"));

        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

        return services;
    }
}
