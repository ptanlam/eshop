using Autofac;
using MassTransit;
using Microsoft.AspNetCore.Identity.UI.Services;
using NotificationSerivce.Infrastructure.Messaging.Consumers;
using NotificationSerivce.Infrastructure.Services;
using NotificationService.Infrastructure.Settings;
using System;
using System.Reflection;
using Module = Autofac.Module;

namespace NotificationSerivce.Infrastructure
{
    public class InfrastructureModule : Module
    {
        private readonly RabbitMqOptions _rabbitMqOptions;

        public InfrastructureModule(RabbitMqOptions rabbitMqOptions)
        {
            _rabbitMqOptions = rabbitMqOptions ??
                throw new ArgumentNullException(nameof(rabbitMqOptions));
        }

        protected override void Load(Autofac.ContainerBuilder builder)
        {
            builder.RegisterGeneric(typeof(MessageLogger<,>))
               .As(typeof(IMessageLogger<,>))
               .InstancePerLifetimeScope();

            builder.RegisterType(typeof(MailKitEmailSender))
                .As(typeof(IEmailSender))
                .InstancePerDependency();

            builder.AddMassTransit(x =>
            {
                x.SetKebabCaseEndpointNameFormatter();

                x.AddConsumers(Assembly.GetExecutingAssembly());

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(new Uri(_rabbitMqOptions.HostAddress), h =>
                    {
                        h.Username(_rabbitMqOptions.UserName);
                        h.Password(_rabbitMqOptions.Password);
                    });

                    cfg.ReceiveEndpoint("order.created.notification", e =>
                    {
                        e.ConfigureConsumer<OrderCreatedIntegrationEventConsumer>(context);
                    });
                });
            });
        }
    }
}