namespace OrderingService.Infrastructure.Options
{
    public class RabbitMqOptions
    {
        public const string Name = "RabbitMqOptions";

        public string UserName { get; init; }
        public string Password { get; init; }
        public string HostName { get; init; }
    }
}