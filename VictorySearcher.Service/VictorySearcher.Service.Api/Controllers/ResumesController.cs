using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VictorySearcher.Service.Application.Resumes;
using VictorySearcher.Service.Application.Resumes.Dtos;
using VictorySearcher.Service.Domain.Enums;

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
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);
        return StatusCode(StatusCodes.Status201Created);
    }

    [HttpGet]
    [ProducesResponseType<PagedResumesDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPagedAsync(
        Guid vacancyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default) {
        var result = await resumeService.GetPagedAsync(vacancyId, page, pageSize, ct);
        return Ok(result.Value);
    }

    [HttpGet("{resumeId:guid}/content")]
    [ProducesResponseType<ResumeContentDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetContentAsync(Guid vacancyId, Guid resumeId, CancellationToken ct) {
        var result = await resumeService.GetContentAsync(vacancyId, resumeId, ct);
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);
        return Ok(result.Value);
    }

    [HttpGet("{resumeId:guid}/download")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadAsync(Guid vacancyId, Guid resumeId, CancellationToken ct) {
        var result = await resumeService.GetFileAsync(vacancyId, resumeId, ct);
        if (!result.IsSuccess) return StatusCode(result.Error!.StatusCode, result.Error);

        var file = result.Value!;
        var mimeType = file.Format switch {
            FileFormat.PDF => "application/pdf",
            FileFormat.DOCX => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "text/plain"
        };

        return File(file.Data, mimeType, file.FileName);
    }
}
