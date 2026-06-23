using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence.Configurations;

public class VacancyConfiguration : IEntityTypeConfiguration<Vacancy> {
    public void Configure(EntityTypeBuilder<Vacancy> builder) {
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Title).HasMaxLength(500).IsRequired();
        builder.Property(v => v.Description).IsRequired();
        builder.Property(v => v.Requirements).IsRequired();
        builder.Property(v => v.ExtraRequirements).IsRequired(false);

        builder.HasOne(v => v.CreatedBy)
            .WithMany(u => u.Vacancies)
            .HasForeignKey(v => v.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
