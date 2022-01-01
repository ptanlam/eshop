using Ardalis.Specification;
using System;
using System.Linq;

namespace OrderingService.Core.OrderAggregateRoot.Specifications
{
    public class OrderDetailsByIdSpec : Specification<Order>, ISingleResultSpecification
    {
        public OrderDetailsByIdSpec(Guid id)
        {
            Query
                .Where(o => o.Id == id)
                .Include(o => o.Items.OrderByDescending(i => i.Price.Amount))
                .Include(o => o.Journeys.OrderByDescending(j => j.TimeStamp))
                .OrderByDescending(o => o.CreatedAt)
                .AsSplitQuery(); 
        }
    }
}