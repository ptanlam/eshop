using System;
using System.Collections.Generic;

namespace OrderingService.API.Models
{
    public record OrderBaseDto()
    {
        public Guid Id { get; init; }
        public string Notes { get; init; }
        public string Status { get; init; }
        public DateTime CreatedAt { get; init; }
        public decimal TotalPrice { get; init; }
        public string PriceUnit { get; init; }
        public IEnumerable<JourneyDto> Journeys { get; init; }
    }
}