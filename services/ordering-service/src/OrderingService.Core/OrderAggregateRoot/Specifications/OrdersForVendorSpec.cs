using Ardalis.Specification;
using System;
using System.Linq;

namespace OrderingService.Core.OrderAggregateRoot.Specifications
{
    public class OrdersForVendorSpec : Specification<Order>
    {
        public OrdersForVendorSpec(string vendorId)
        {
            Query
                .Where(o => o.VendorId == Guid.Parse(vendorId))
                .Include(o => o.Items.OrderByDescending(i => i.Price.Amount))
                .Include(o => o.Journeys.OrderByDescending(i => i.TimeStamp).Take(1))
                .OrderByDescending(o => o.CreatedAt)
                .AsSplitQuery();
        }
    }
}