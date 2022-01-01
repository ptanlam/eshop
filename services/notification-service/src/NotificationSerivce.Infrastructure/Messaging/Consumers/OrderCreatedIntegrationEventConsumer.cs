using MassTransit;
using Microsoft.AspNetCore.Identity.UI.Services;
using NotificationSerivce.Infrastructure.Services;
using NotificationService.Core.Interfaces;
using NotificationService.Core.NotificationAggregateRoot;
using OrderingService.Messaging.IntegrationEvents;
using System;
using System.Threading.Tasks;

namespace NotificationSerivce.Infrastructure.Messaging.Consumers
{
    public class OrderCreatedIntegrationEventConsumer : IConsumer<OrderCreatedIntegrationEvent>
    {
        private readonly IMessageLogger<OrderCreatedIntegrationEventConsumer,
            OrderCreatedIntegrationEvent> _logger;

        private readonly INotificationRepository _repository;
        private readonly IEmailSender _emailSender;

        public OrderCreatedIntegrationEventConsumer(
            IMessageLogger<OrderCreatedIntegrationEventConsumer,
                OrderCreatedIntegrationEvent> logger,
            INotificationRepository repository,
            IEmailSender emailSender)
        {
            _logger = logger ??
                throw new ArgumentNullException(nameof(logger));

            _repository = repository ??
                throw new ArgumentNullException(nameof(repository));

            _emailSender = emailSender ??
                throw new ArgumentNullException(nameof(emailSender));
        }

        public async Task Consume(ConsumeContext<OrderCreatedIntegrationEvent> context)
        {
            var receivedAt = DateTime.UtcNow;

            _logger.AnnounceReceivedMessage(context.CorrelationId, context.SentTime, receivedAt,
               context.MessageId, context.Host.Assembly);

            var notification = new Notification()
            {
                ReceiverEmail = context.Message.CustomerEmail,
                Content = "Your order has been created, the vendor will call you soon" +
                    "to confirm your information. " +
                    "If there are any problems, please contact us. 😅",
                SentAt = receivedAt,
            };

            // Saved notification to customer
            await _repository.AddNotificationForUser(notification);

            // Send email to customer
            await _emailSender.SendEmailAsync(
                context.Message.CustomerEmail,
                "Your order on eShop",
                @$"<div>
                <h1>Your order has been created successfully!</h1>
                </div>");
        }
    }
}