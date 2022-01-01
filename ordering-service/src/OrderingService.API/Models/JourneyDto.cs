using System;

namespace OrderingService.API.Models
{
    public record JourneyDto
    {
        public int Id { get; init; }
        public string Location { get; init; }
        public string Notes { get; init; }
        public DateTime TimeStamp { get; init; }
    }
}