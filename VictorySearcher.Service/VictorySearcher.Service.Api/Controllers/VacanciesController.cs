using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VictorySearcher.Service.Api.Contracts;
using VictorySearcher.Service.Application.Vacancies;

namespace VictorySearcher.Service.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/vacancies")]
public class VacanciesController(IVacancyService vacancyService) : ControllerBase {
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateAsync(CreateVacancyRequest request, CancellationToken ct) {
        var createdById = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await vacancyService.CreateAsync(
            request.Title,
            request.Description,
            request.Requirements,
            request.ExtraRequirements,
            createdById,
            ct);

        return StatusCode(StatusCodes.Status201Created, result.Value);
    }
}
