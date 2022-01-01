using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.Infrastructure.Data.EntityTypesConfiguration
{
    public class ItemEntityTypeConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.ToTable("Items");

            builder.HasKey(i => i.Id);
            builder.Property(i => i.Id)
                .ValueGeneratedOnAdd();

            builder.OwnsOne(i => i.Price, price =>
            {
                price.Property(p => p.Amount)
                    .HasColumnType("decimal(10,2)")
                    .HasPrecision(10, 2)
                    .HasColumnName("Price");

                price.Property(p => p.Unit)
                    .HasColumnName("PriceUnit")
                    .HasMaxLength(3);
            });
        }
    }
}