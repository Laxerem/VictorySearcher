using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Infrastructure;
using VictorySearcher.Service.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.Run();
