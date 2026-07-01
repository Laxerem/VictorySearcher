using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence.Configurations;

public class VacancyConfiguration : IEntityTypeConfiguration<Vacancy> {
    public void Configure(EntityTypeBuilder<Vacancy> builder) {
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Title).HasMaxLength(100).IsRequired();
        builder.Property(v => v.Description).HasMaxLength(5_000).IsRequired();
        builder.Property(v => v.Requirements).HasMaxLength(5_000).IsRequired();
        builder.Property(v => v.ExtraRequirements).HasMaxLength(3_000).IsRequired(false);
        builder.Property(v => v.Trend).HasMaxLength(40).IsRequired(false);

        builder.HasOne(v => v.CreatedBy)
            .WithMany(u => u.Vacancies)
            .HasForeignKey(v => v.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
