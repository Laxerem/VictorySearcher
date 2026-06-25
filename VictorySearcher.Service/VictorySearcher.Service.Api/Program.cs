using System.Text.Json;
using System.Text.Json.Serialization;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Serilog;
using VictorySearcher.Service.Api.Extensions;
using VictorySearcher.Service.Application;
using VictorySearcher.Service.Infrastructure;
using VictorySearcher.Service.Infrastructure.Options;
using VictorySearcher.Service.Infrastructure.Persistence;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

builder.AddSerilogLogging();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));
builder.Services.AddSwagger();

var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var jwtOpts = scope.ServiceProvider.GetRequiredService<IOptions<JwtOptions>>().Value;
    await db.Database.MigrateAsync();
    await AppDbContextSeed.SeedAsync(db, jwtOpts);
}

var llmOpts = app.Services.GetRequiredService<IOptions<LlmOptions>>().Value;
var resumeAnalyserOptions = app.Services.GetRequiredService<IOptions<ResumeAnalyserOptions>>().Value;
Log.Information("LLM provider: {BaseUrl}, model: {ModelId}", llmOpts.BaseUrl, llmOpts.ModelId);
Log.Information("LLM Analyser system prompt: {prompt}", resumeAnalyserOptions.SystemPrompt);

if (app.Environment.IsDevelopment()) {
    app.UseSwaggerWithUi();
}

app.UseSerilogLogging();
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfire");
app.MapControllers();

app.Run();
