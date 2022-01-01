namespace NotificationService.Infrastructure.Settings
{
    public class RabbitMqOptions
    {
        public string HostAddress { get; init; }
        public string UserName { get; init; }
        public string Password { get; init; }
    }
}