using System.Reflection;
using Microsoft.EntityFrameworkCore;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Vacancy> Vacancies => Set<Vacancy>();
    public DbSet<Resume> Resumes => Set<Resume>();
    public DbSet<ScoringRequest> ScoringRequests => Set<ScoringRequest>();
    public DbSet<ScoringResult> ScoringResults => Set<ScoringResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}
