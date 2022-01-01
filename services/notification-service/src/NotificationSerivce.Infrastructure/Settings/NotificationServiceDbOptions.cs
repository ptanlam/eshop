namespace NotificationService.Infrastructure.Settings
{
    public class NotificationServiceDbOptions
    {
        public const string Name = "NotificationServiceDbOptions";

        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string CollectionName { get; set; }
    }
}