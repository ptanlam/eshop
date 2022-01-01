using System;
using System.ComponentModel.DataAnnotations;

namespace OrderingService.API.Models
{
    public record ItemForCreationDto
    {
        public Guid ProductId { get; init; }
        public decimal Price { get; init; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; init; }

        [MaxLength(3)]
        public string PriceUnit { get; init; }
    }
}