#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["src/NotificationService.API/NotificationService.API.csproj", "src/NotificationService.API/"]
COPY ["src/NotificationSerivce.Infrastructure/NotificationSerivce.Infrastructure.csproj", "src/NotificationSerivce.Infrastructure/"]
COPY ["src/NotificationService.Core/NotificationService.Core.csproj", "src/NotificationService.Core/"]
RUN dotnet restore "src/NotificationService.API/NotificationService.API.csproj"
COPY . .
WORKDIR "/src/src/NotificationService.API"
RUN dotnet build "NotificationService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NotificationService.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.API.dll"]