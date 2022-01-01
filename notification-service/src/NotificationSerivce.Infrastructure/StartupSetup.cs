using Microsoft.Extensions.DependencyInjection;
using NotificationSerivce.Infrastructure.Data;
using NotificationService.Core.Interfaces;

namespace NotificationSerivce.Infrastructure
{
    public static class StartupSetup
    {
        public static IServiceCollection AddNotificationRepository(
            this IServiceCollection services) => services.AddSingleton<INotificationRepository,
                NotificationRepository>();
    }
}