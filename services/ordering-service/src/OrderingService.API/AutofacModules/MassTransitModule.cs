using Autofac;
using MassTransit;
using OrderingService.Infrastructure.Options;
using OrderingService.Messaging.IntegrationEvents;
using System;
using System.Reflection;
using Module = Autofac.Module;

namespace OrderingService.API.AutofacModules
{
    public class MassTransitModule : Module
    {
        private readonly RabbitMqOptions _rabbitMqOptions;

        public MassTransitModule(RabbitMqOptions rabbitMqOptions)
        {
            _rabbitMqOptions = rabbitMqOptions ??
                throw new ArgumentNullException(nameof(rabbitMqOptions));
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.AddMassTransit(x =>
            {
                x.AddConsumers(Assembly.GetExecutingAssembly());

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(new Uri(_rabbitMqOptions.HostName), h =>
                    {
                        h.Username(_rabbitMqOptions.UserName);
                        h.Password(_rabbitMqOptions.Password);
                    });

                    cfg.ReceiveEndpoint("payment.success.order", e =>
                    {
                        e.Durable = false;
                        e.ConfigureConsumer<PaymentCreatedIntegrationEventConsumer>(context);
                    });

                    cfg.Publish<OrderCreatedIntegrationEvent>(p =>
                    {
                        // Send order created notification
                        p.BindAlternateExchangeQueue(
                           "order",
                           "order.created.notification");

                        // Removed all the items in customer's basket
                        p.BindAlternateExchangeQueue(
                            "order",
                            "order.created.basket");
                    });

                    cfg.Publish<OrderApprovedIntegrationEvent>(p =>
                    {
                        // Approve order and remove item quantity
                        // in catalog service
                        p.BindAlternateExchangeQueue(
                           "order",
                           "order.approved.catalog");
                    });

                    cfg.Publish<OrderCancelledIntegrationEvent>(p =>
                    {
                        // Cancel order and add item quantity
                        // in catalog service
                        p.BindAlternateExchangeQueue(
                           "order",
                           "order.cancelled.catalog");

                        // Cancel order and refund
                        // in payment service
                        p.BindAlternateExchangeQueue(
                           "order",
                           "order.cancelled.payment");
                    });
                });
            });
        }
    }
}