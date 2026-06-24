using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VictorySearcher.Service.Application.Scoring;
using VictorySearcher.Service.Application.Scoring.Dtos;

namespace VictorySearcher.Service.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/vacancies/{vacancyId:guid}/scoring")]
public class ScoringController(IScoringService scoringService) : ControllerBase {
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> EnqueueAsync(Guid vacancyId, CancellationToken ct) {
        var result = await scoringService.EnqueueAsync(vacancyId, ct);
        return result.Error switch {
            "not_found" => NotFound(),
            _ => Accepted()
        };
    }

    [HttpGet("status")]
    [ProducesResponseType<ScoringStatusDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetStatusAsync(Guid vacancyId, CancellationToken ct) {
        var result = await scoringService.GetStatusAsync(vacancyId, ct);
        return result.Error switch {
            "not_found" => NotFound(),
            _ => Ok(result.Value)
        };
    }

    [HttpGet("results")]
    [ProducesResponseType<List<ScoringResultDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetResultsAsync(Guid vacancyId, CancellationToken ct) {
        var result = await scoringService.GetResultsAsync(vacancyId, ct);
        return result.Error switch {
            "not_found" => NotFound(),
            _ => Ok(result.Value)
        };
    }
}
