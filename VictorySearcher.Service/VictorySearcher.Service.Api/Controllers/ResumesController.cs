using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VictorySearcher.Service.Application.Resumes;

namespace VictorySearcher.Service.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/vacancies/{vacancyId:guid}/resumes")]
public class ResumesController(IResumeService resumeService) : ControllerBase {
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadAsync(Guid vacancyId, IFormFile file, CancellationToken ct) {
        var result = await resumeService.UploadAsync(vacancyId, file.FileName, file.OpenReadStream(), ct);

        return result.Error switch {
            "invalid_format" => BadRequest("Only .txt files are allowed."),
            "not_found" => NotFound(),
            _ when result.IsSuccess => StatusCode(StatusCodes.Status201Created),
            _ => StatusCode(StatusCodes.Status500InternalServerError)
        };
    }
}
