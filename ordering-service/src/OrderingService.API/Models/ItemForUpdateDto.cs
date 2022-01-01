namespace OrderingService.API.Models
{
    public record ItemForUpdateDto
    {
        public string Operator { get; init; }
        public int Quantity { get; init; }
    }
}