using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using NotificationService.Core.Interfaces;
using NotificationService.Core.NotificationAggregateRoot;
using System;
using System.Threading.Tasks;

namespace NotificationService.API.Hubs
{
    public class NotificationHub : Hub<INotificationHub>
    {
        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            string connectionId = Context.ConnectionId;

            var context = Context.User;

            await Clients.Client(connectionId).ReceiveWelcomeNotification(new Notification
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Welcome to eShop 🤗 Are you ready to experience the enhanced online shopping experience?",
                Note = "Hope you enjoy!",
                SentAt = DateTime.UtcNow
            });
        }
    }
}