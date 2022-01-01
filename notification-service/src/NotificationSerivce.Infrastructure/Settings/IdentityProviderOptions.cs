namespace NotificationSerivce.Infrastructure.Settings
{
    public class IdentityProviderOptions
    {
        public const string Name = "IdentityProviderOptions";

        public string Authority { get; init; }
        public string Audience { get; init; }
    }
}