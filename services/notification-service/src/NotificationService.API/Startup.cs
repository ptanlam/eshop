using Autofac;
using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using NotificationSerivce.Infrastructure;
using NotificationSerivce.Infrastructure.Settings;
using NotificationService.API.Extensions;
using NotificationService.API.Hubs;
using NotificationService.Infrastructure.Settings;

namespace NotificationService.API
{
    public class Startup
    {
        private readonly string _corsPolicy = "CorsPolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var corsOptions = Configuration.GetSection(CorsOptions.Name)
                .Get<CorsOptions>();

            services.AddCors(options =>
            {
                options.AddPolicy(_corsPolicy, builder =>
                {
                    builder.WithOrigins(corsOptions.AllowedOrigins.Split(','))
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .AllowAnyMethod();
                });
            });

            services.AddSingleton(sp => sp
                .GetRequiredService<IOptions<NotificationServiceDbOptions>>().Value);

            services.Configure<NotificationServiceDbOptions>(
                Configuration.GetSection(NotificationServiceDbOptions.Name));

            services.AddNotificationRepository();

            services.AddControllers();

            services.ConfigureMailKitEmailSender(Configuration);

            services.AddCustomAuthentication(
                Configuration.GetSection(IdentityProviderOptions.Name)
                    .Get<IdentityProviderOptions>());

            services.AddCustomerSwagger();
            services.AddSignalR();
            services.AddHealthChecks();
            services.AddMassTransitHostedService();
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule(
                new InfrastructureModule(Configuration.GetSection(
                        nameof(RabbitMqOptions)).Get<RabbitMqOptions>()));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint(
                    "/swagger/v1/swagger.json",
                    "NotificationService.Api v1"));
            }

            app.UseRouting();

            app.UseCors(_corsPolicy);

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<NotificationHub>("/hubs/notification");
                endpoints.MapHealthChecks("health");
            });
        }
    }
}