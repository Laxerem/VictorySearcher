using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence.Configurations;

public class ScoringResultConfiguration : IEntityTypeConfiguration<ScoringResult>
{
    public void Configure(EntityTypeBuilder<ScoringResult> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Reasoning).IsRequired();
        builder.Property(r => r.ExtraScore).IsRequired(false);

        builder.HasIndex(r => r.RequestId);

        builder.HasOne(r => r.Request)
            .WithMany(req => req.Results)
            .HasForeignKey(r => r.RequestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Resume)
            .WithMany(res => res.ScoringResults)
            .HasForeignKey(r => r.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
