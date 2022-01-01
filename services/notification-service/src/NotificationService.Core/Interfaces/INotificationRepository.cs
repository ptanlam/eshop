using NotificationService.Core.NotificationAggregateRoot;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NotificationService.Core.Interfaces
{
    public interface INotificationRepository
    {
        Task<(IEnumerable<Notification> notifications, long total)> GetNotificationsForUserAsync(
            string email, int limit, int offset);

        Task<Notification> AddNotificationForUser(Notification notification);

        Task<bool> MarkNotificationsToBeSeenAsync(IEnumerable<string> notificationIds);

        Task<bool> DeleteNotifications(IEnumerable<string> notificationIds);
    }
}