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

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllAsync(CancellationToken ct) {
        var result = await vacancyService.GetAllAsync(ct);
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(Guid id, CancellationToken ct) {
        var result = await vacancyService.GetByIdAsync(id, ct);

        return result.Error switch {
            "not_found" => NotFound(),
            _ => Ok(result.Value)
        };
    }
}
