using NotificationService.Core.NotificationAggregateRoot;
using System.Threading.Tasks;

namespace NotificationService.Core.Interfaces
{
    public interface INotificationHub
    {
        Task ReceiveWelcomeNotification(Notification notification);
    }
}