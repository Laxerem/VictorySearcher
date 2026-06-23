using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence.Configurations;

public class ResumeConfiguration : IEntityTypeConfiguration<Resume> {
    public void Configure(EntityTypeBuilder<Resume> builder) {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.FileName).HasMaxLength(500).IsRequired();
        builder.Property(r => r.FilePath).HasMaxLength(1000).IsRequired();

        builder.HasOne(r => r.Vacancy)
            .WithMany(v => v.Resumes)
            .HasForeignKey(r => r.VacancyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
