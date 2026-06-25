using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace VictorySearcher.Service.Api.Results;

public sealed class SseResult<T>(IAsyncEnumerable<T> events) : IActionResult {
    public async Task ExecuteResultAsync(ActionContext context) {
        var response = context.HttpContext.Response;
        var ct = context.HttpContext.RequestAborted;

        response.ContentType = "text/event-stream";
        response.Headers.CacheControl = "no-cache";
        response.Headers.Connection = "keep-alive";
        // response.Headers["X-Accel-Buffering"] = "no"; // раскомментировать при наличии nginx

        var opts = context.HttpContext.RequestServices
            .GetRequiredService<IOptions<Microsoft.AspNetCore.Mvc.JsonOptions>>()
            .Value.JsonSerializerOptions;

        await foreach (var evt in events.WithCancellation(ct)) {
            var json = JsonSerializer.Serialize(evt, opts);
            await response.WriteAsync($"data: {json}\n\n", Encoding.UTF8, ct);
            await response.Body.FlushAsync(ct);
        }
    }
}
