#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["src/OrderingService.API/OrderingService.API.csproj", "src/OrderingService.API/"]
COPY ["src/OrderingService.Infrastructure/OrderingService.Infrastructure.csproj", "src/OrderingService.Infrastructure/"]
COPY ["src/OrderingService.Core/OrderingService.Core.csproj", "src/OrderingService.Core/"]
COPY ["src/OrderingService.SharedKernel/OrderingService.SharedKernel.csproj", "src/OrderingService.SharedKernel/"]
RUN dotnet restore "src/OrderingService.API/OrderingService.API.csproj"
COPY . .
WORKDIR "/src/src/OrderingService.API"
RUN dotnet build "OrderingService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OrderingService.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OrderingService.API.dll"]
