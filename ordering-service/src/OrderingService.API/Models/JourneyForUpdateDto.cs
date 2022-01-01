namespace OrderingService.API.Models
{
    public record JourneyForUpdateDto
    {
        public string Location { get; init; }
        public string Notes { get; init; }
    }
}