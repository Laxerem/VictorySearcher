using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VictorySearcher.Service.Api.Contracts;
using VictorySearcher.Service.Application.Interfaces;

namespace VictorySearcher.Service.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
public class AuthController(IAuthService authService) : ControllerBase {
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request, CancellationToken ct) {
        var result = await authService.LoginAsync(request.Login, request.Password, ct);
        if (!result.IsSuccess) return Unauthorized();
        return Ok(new LoginResponse(result.Value!));
    }
}
