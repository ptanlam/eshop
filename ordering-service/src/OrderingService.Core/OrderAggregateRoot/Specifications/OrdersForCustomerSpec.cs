using Ardalis.Specification;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OrderingService.Core.OrderAggregateRoot.Specifications
{
    public class OrdersForCustomerSpec : Specification<Order>
    {
        public OrdersForCustomerSpec(IEnumerable<Guid> customerIds)
        {
            Query
                .Where(o => customerIds.Contains(o.CustomerId) && o.DeletedAt == null)
                .Include(o => o.Items.OrderByDescending(i => i.Price.Amount))
                .Include(o => o.Journeys.OrderByDescending(i => i.TimeStamp).Take(1))
                .OrderByDescending(o => o.CreatedAt)
                .AsSplitQuery();
        }
    }
}