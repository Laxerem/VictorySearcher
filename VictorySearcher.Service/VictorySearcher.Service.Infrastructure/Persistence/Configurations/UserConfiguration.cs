using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using VictorySearcher.Service.Domain.Entities;

namespace VictorySearcher.Service.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Login).HasMaxLength(256).IsRequired();
        builder.HasIndex(u => u.Login).IsUnique();
        builder.Property(u => u.PasswordHash).IsRequired();
    }
}
