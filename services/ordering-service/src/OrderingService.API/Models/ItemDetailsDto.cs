namespace OrderingService.API.Models
{
    public record ItemDetailsDto
    {
        public int Id { get; init; }
        public decimal Price { get; init; }
        public decimal TotalPrice { get; init; }
        public string PriceUnit { get; init; }
        public int Quantity { get; init; }
        public GetProductByIdResponse Product { get; set; }
    }
}