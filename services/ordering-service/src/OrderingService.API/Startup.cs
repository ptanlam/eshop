using Autofac;
using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using OrderingService.API.AutofacModules;
using OrderingService.Infrastructure;
using OrderingService.Infrastructure.Options;
using System;

namespace OrderingService.API
{
    public class Startup
    {
        private readonly string _corsPolicy = "CustomerWebClientCorsPolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

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

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "OrderingService.API",
                    Version = "v1"
                });
            });

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddApplicationDbContext(
                Configuration.GetConnectionString("DefaultConnection"));

            var grpcConnection = Configuration.GetSection(GrpcConnectionOptions.Name)
               .Get<GrpcConnectionOptions>();
            services.AddGrpcClient<VendorsService.VendorsServiceClient>(opt =>
            {
                opt.Address = new Uri(grpcConnection.VendorsServiceUrl);
            });
            services.AddGrpcClient<PaymentsService.PaymentsServiceClient>(opt =>
            {
                opt.Address = new Uri(grpcConnection.PaymentsServiceUrl);
            });
            services.AddGrpcClient<ProductsService.ProductsServiceClient>(opt =>
            {
                opt.Address = new Uri(grpcConnection.CatalogServiceUrl);
            });

            services.AddMassTransitHostedService();
            services.AddHealthChecks();
        }

        // Register all modules from core, infrastructure and application by Autofac
        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule(new InfrastructureModule());

            builder.RegisterModule(new MassTransitModule(
                Configuration.GetSection(RabbitMqOptions.Name).Get<RabbitMqOptions>()));

            builder.RegisterModule(new MediatorModule());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint(
                    "/swagger/v1/swagger.json", "OrderingService.API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(_corsPolicy);

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("health");
            });
        }
    }
}