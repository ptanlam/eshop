using MassTransit;
using Serilog;
using System;

namespace NotificationSerivce.Infrastructure.Services
{
    public class MessageLogger<TConsumer, TMessage> :
        IMessageLogger<TConsumer, TMessage>
        where TConsumer : IConsumer
    {
        public void AnnounceReceivedMessage(Guid? correlationId, DateTime? sentAt,
            DateTime receivedAt, Guid? messageId, string producer)
        {
            Log.Information("Message type: Event \n" +
               "Service name: Notification Service \n" +
               "Correlation id: {CorrelationId} \n" +
               "Message sent time in UTC: {SentTime} \n" +
               "Message received time in UTC: {ReceivedTime} \n" +
               "Consumer name: {ConsumerName} \n" +
               "Message name: {EventName} \n" +
               "Message id: {EventId} \n" +
               "Producer: {Producer}",
               correlationId, sentAt, receivedAt,
               typeof(TConsumer).Name, typeof(TMessage).Name,
               messageId, producer);
        }

        public void AnnounceHandledMessage(string content, Guid? messageId, DateTime receivedAt)
        {
            Log.Information("{Content} " +
                "from event {IntegrationEvent} having id {IntegrationEventId} after {ProcessTime}",
                content, typeof(TMessage).Name, messageId, DateTime.UtcNow - receivedAt);
        }
    }
}