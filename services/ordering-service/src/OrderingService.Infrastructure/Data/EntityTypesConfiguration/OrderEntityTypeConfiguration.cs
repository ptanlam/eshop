using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.Infrastructure.Data.EntityTypesConfiguration
{
    public class OrderEntityTypeConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");

            builder.HasKey(o => o.Id);

            builder.HasMany(o => o.Items);
            builder.HasMany(o => o.Journeys);
        }
    }
}