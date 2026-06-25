using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VictorySearcher.Service.Api.Results;
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
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);
        return Accepted();
    }

    [HttpGet("status")]
    [ProducesResponseType<ScoringStatusDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetStatusAsync(Guid vacancyId, CancellationToken ct) {
        var result = await scoringService.GetStatusAsync(vacancyId, ct);
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);
        return Ok(result.Value);
    }

    [HttpGet("results")]
    [ProducesResponseType<List<ScoringResultDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetResultsAsync(Guid vacancyId, CancellationToken ct) {
        var result = await scoringService.GetResultsAsync(vacancyId, ct);
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);
        return Ok(result.Value);
    }

    [HttpGet("stream")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> StreamProgressAsync(Guid vacancyId, CancellationToken ct) {
        var result = await scoringService.StreamProgressAsync(vacancyId, ct);
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);
        return new SseResult<ScoringProgressEvent>(result.Value!);
    }
}
