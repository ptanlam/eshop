namespace OrderingService.API.Models
{
    public record JourneyForCreationDto
    {
        public string Notes { get; init; }
        public string Location { get; init; }
    }
}