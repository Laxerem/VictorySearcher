using Serilog;
using Serilog.Events;

namespace VictorySearcher.Service.Api.Extensions;

public static class SerilogExtensions {
    public static WebApplicationBuilder AddSerilogLogging(this WebApplicationBuilder builder) {
        builder.Host.UseSerilog((_, cfg) => cfg
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Warning)
            .MinimumLevel.Override("Hangfire", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(outputTemplate:
                "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}"));

        return builder;
    }

    public static WebApplication UseSerilogLogging(this WebApplication app) {
        app.UseSerilogRequestLogging(opts => {
            opts.MessageTemplate =
                "HTTP {RequestMethod} {RequestPath} → {StatusCode} in {Elapsed:0}ms";
        });

        return app;
    }
}
