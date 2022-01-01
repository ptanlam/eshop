namespace OrderingService.Infrastructure.Options
{
    public record GrpcConnectionOptions
    {
        public const string Name = "GrpcConnectionOptions";

        public string VendorsServiceUrl { get; init; }
        public string PaymentsServiceUrl { get; init; }
        public string CatalogServiceUrl { get; init; }
    }
}