using FluentValidation;
using VictorySearcher.Service.Api.Contracts;

namespace VictorySearcher.Service.Api.Validators;

public class CreateVacancyRequestValidator : AbstractValidator<CreateVacancyRequest> {
    public CreateVacancyRequestValidator() {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Description)
            .NotEmpty()
            .MaximumLength(5_000);

        RuleFor(x => x.Requirements)
            .NotEmpty()
            .MaximumLength(5_000);

        RuleFor(x => x.ExtraRequirements)
            .MaximumLength(3_000)
            .When(x => x.ExtraRequirements is not null);

        RuleFor(x => x.Trend)
            .MaximumLength(40)
            .When(x => x.Trend is not null);
    }
}
