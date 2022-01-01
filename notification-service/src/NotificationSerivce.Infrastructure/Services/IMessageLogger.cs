using MassTransit;
using System;

namespace NotificationSerivce.Infrastructure.Services
{
    public interface IMessageLogger<TConsumer, IMessage>
       where TConsumer : IConsumer
    {
        void AnnounceReceivedMessage(Guid? correlationId, DateTime? sentAt, DateTime receivedAt,
            Guid? messageId, string producer);

        void AnnounceHandledMessage(string content, Guid? messageId, DateTime receivedAt);
    }
}