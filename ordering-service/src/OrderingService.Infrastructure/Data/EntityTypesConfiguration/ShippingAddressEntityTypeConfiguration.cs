using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.Infrastructure.Data.EntityTypesConfiguration
{
    public class ShippingAddressEntityTypeConfiguration : IEntityTypeConfiguration<ShippingAddress>
    {
        public void Configure(EntityTypeBuilder<ShippingAddress> builder)
        {
            builder.ToTable("ShippingAddresses");

            builder.HasKey(p => p.Id);
        }
    }
}