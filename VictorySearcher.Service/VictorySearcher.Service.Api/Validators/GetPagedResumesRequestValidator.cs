using FluentValidation;
using VictorySearcher.Service.Api.Contracts;

namespace VictorySearcher.Service.Api.Validators;

public class GetPagedResumesRequestValidator : AbstractValidator<GetPagedResumesRequest> {
    public GetPagedResumesRequestValidator() {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be greater than or equal to 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("PageSize must be between 1 and 50.");
    }
}
