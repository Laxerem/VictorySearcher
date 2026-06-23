using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence.Configurations;

public class ScoringRequestConfiguration : IEntityTypeConfiguration<ScoringRequest> {
    public void Configure(EntityTypeBuilder<ScoringRequest> builder) {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Status).IsRequired();
        builder.Property(r => r.ErrorMessage).IsRequired(false);
        builder.Property(r => r.FinishedAt).IsRequired(false);

        builder.HasIndex(r => r.VacancyId);

        builder.HasOne(r => r.Vacancy)
            .WithMany(v => v.ScoringRequests)
            .HasForeignKey(r => r.VacancyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
