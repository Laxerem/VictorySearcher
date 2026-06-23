using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using VictorySearcher.Service.Api.Extensions;
using VictorySearcher.Service.Infrastructure;
using VictorySearcher.Service.Infrastructure.Options;
using VictorySearcher.Service.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
    var db      = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var jwtOpts = scope.ServiceProvider.GetRequiredService<IOptions<JwtOptions>>().Value;
    await db.Database.MigrateAsync();
    await AppDbContextSeed.SeedAsync(db, jwtOpts);
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
