using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.Infrastructure.Data.EntityTypesConfiguration
{
    public class JourneyEntityTypeConfiguration : IEntityTypeConfiguration<Journey>
    {
        public void Configure(EntityTypeBuilder<Journey> builder)
        {
            builder.ToTable("Journeys");

            builder.HasKey(j => j.Id);
            builder.Property(j => j.Id)
                .ValueGeneratedOnAdd();
        }
    }
}