using Autofac;
using MediatR;
using OrderingService.Infrastructure.Data;
using OrderingService.SharedKernel.Interfaces;
using Module = Autofac.Module;

namespace OrderingService.Infrastructure
{
    public class InfrastructureModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterGeneric(typeof(EfRepository<>))
               .As(typeof(IRepository<>))
               .As(typeof(IReadRepository<>))
               .InstancePerLifetimeScope();

            builder.RegisterType<Mediator>()
                .As<IMediator>()
                .InstancePerLifetimeScope();

            builder.Register<ServiceFactory>(context =>
            {
                var c = context.Resolve<IComponentContext>();
                return t => c.Resolve(t);
            });
        }
    }
}