using Autofac;
using MediatR;
using OrderingService.API.Application.Commands;
using System.Reflection;
using Module = Autofac.Module;

namespace OrderingService.API.AutofacModules
{
    public class MediatorModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder
                .RegisterAssemblyTypes(typeof(CreateNewOrderCommand).GetTypeInfo().Assembly)
                .AsClosedTypesOf(typeof(IRequestHandler<,>));

            builder
                .RegisterAssemblyTypes(typeof(CreateNewOrderCommandHandler).GetTypeInfo().Assembly)
                .AsClosedTypesOf(typeof(INotificationHandler<>));
        }
    }
}