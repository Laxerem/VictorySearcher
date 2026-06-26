using FluentValidation;
using VictorySearcher.Service.Api.Contracts;

namespace VictorySearcher.Service.Api.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest> {
    public LoginRequestValidator() {
        RuleFor(x => x.Login)
            .NotEmpty()
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}
