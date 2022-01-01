using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderingService.Core.SyncedAggregates;

namespace OrderingService.Infrastructure.Data.EntityTypesConfiguration
{
    public class CustomerEntityTypeConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.ToTable("Customers");

            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id)
                .HasMaxLength(250);

            builder.Property(c => c.Email)
                .HasMaxLength(320);

            builder.Property(c => c.PhoneNumber)
                .HasMaxLength(15);

            builder.HasIndex(c => new { c.Email, c.PhoneNumber })
               .IsUnique();
        }
    }
}