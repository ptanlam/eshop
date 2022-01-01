namespace OrderingService.Infrastructure.Options
{
    public class CorsOptions
    {
        public const string Name = "CorsOptions";

        public string AllowedOrigins { get; set; }
    }
}