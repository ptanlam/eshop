using System;

namespace OrderingService.API.Models
{
    public record ItemDto
    {
        public int Id { get; init; }
        public Guid ProductId { get; init; }
        public decimal Price { get; init; }
        public decimal TotalPrice { get; init; }
        public string PriceUnit { get; init; }
        public int Quantity { get; init; }
    }
}