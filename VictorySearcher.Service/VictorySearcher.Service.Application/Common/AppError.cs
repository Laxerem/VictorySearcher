namespace VictorySearcher.Service.Application.Common;

public record AppError(string Message, int StatusCode) {
    public static AppError NotFound(string message = "Not found") => new(message, 404);
    public static AppError BadRequest(string message) => new(message, 400);
    public static AppError Unauthorized(string message = "Unauthorized") => new(message, 401);
    public static AppError Internal(string message = "Internal server error") => new(message, 500);
}
