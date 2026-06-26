namespace VictorySearcher.Service.Api.Middleware;

public class ExceptionHandler(RequestDelegate next, ILogger<ExceptionHandler> logger) {
    public async Task InvokeAsync(HttpContext context) {
        try {
            await next.Invoke(context);
        }
        catch (OperationCanceledException ex) {
            logger.LogError(ex, "Operation was cancelled");
        }
    }
}