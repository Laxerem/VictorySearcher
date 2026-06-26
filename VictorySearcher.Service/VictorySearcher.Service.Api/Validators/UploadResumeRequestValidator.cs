using FluentValidation;
using Microsoft.Extensions.Options;
using VictorySearcher.Service.Api.Contracts;
using VictorySearcher.Service.Api.Options;
using VictorySearcher.Service.Application.Resumes;

namespace VictorySearcher.Service.Api.Validators;

public class UploadResumeRequestValidator : AbstractValidator<UploadResumeRequest> {
    public UploadResumeRequestValidator(IOptions<ResumeUploadOptions> options) {
        var maxBytes = options.Value.MaxFileSizeBytes;
        var maxMb = maxBytes / 1024 / 1024;
        var allowedExtensions = FileFormatExtensions.AllExtensions();

        RuleFor(x => x.File)
            .NotNull()
            .WithMessage("File is required.");

        When(x => x.File is not null, () => {
            RuleFor(x => x.File.Length)
                .GreaterThan(0)
                .WithMessage("File must not be empty.")
                .LessThanOrEqualTo(maxBytes)
                .WithMessage($"File size must not exceed {maxMb} MB.");

            RuleFor(x => Path.GetExtension(x.File.FileName).ToLowerInvariant())
                .Must(allowedExtensions.Contains)
                .WithMessage($"Allowed formats: {string.Join(", ", allowedExtensions)}.");
        });
    }
}
