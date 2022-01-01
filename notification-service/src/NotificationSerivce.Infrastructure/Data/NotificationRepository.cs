using MongoDB.Driver;
using NotificationService.Core.Interfaces;
using NotificationService.Core.NotificationAggregateRoot;
using NotificationService.Infrastructure.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationSerivce.Infrastructure.Data
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly IMongoCollection<Notification> _notificationCollection;

        public NotificationRepository(NotificationServiceDbOptions settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _notificationCollection =
                database.GetCollection<Notification>(settings.CollectionName);
        }

        public async Task<(IEnumerable<Notification> notifications, long total)> GetNotificationsForUserAsync(
            string email, int limit, int offset)
        {
            // build where clause
            var clause = _notificationCollection
                .Find(n => n.ReceiverEmail == email && n.DeletedAt == null);

            var total = await clause.CountDocumentsAsync();

            var notifications = await clause.SortByDescending(n => n.SentAt)
                .Limit(limit)
                .Skip(limit * offset)
                .ToListAsync();

            return (notifications, total);
        }

        public async Task<Notification> AddNotificationForUser(Notification notification)
        {
            await _notificationCollection.InsertOneAsync(notification);
            return notification;
        }

        public async Task<bool> MarkNotificationsToBeSeenAsync(
            IEnumerable<string> notificationIds)
        {
            var seenNotification = Builders<Notification>.Update.Set(n => n.Seen, true);

            var markResult = await _notificationCollection.UpdateManyAsync(
                n => notificationIds.ToList().Contains(n.Id), seenNotification);

            return markResult.IsAcknowledged;
        }

        public async Task<bool> DeleteNotifications(IEnumerable<string> notificationIds)
        {
            var deletedNotification = Builders<Notification>.Update.Set(n => n.DeletedAt, DateTime.UtcNow);

            var deleteResult = await _notificationCollection.UpdateManyAsync(
                n => notificationIds.ToList().Contains(n.Id), deletedNotification);

            return deleteResult.IsAcknowledged;
        }
    }
}