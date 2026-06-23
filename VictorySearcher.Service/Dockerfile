FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY VictorySearcher.Service.Domain/VictorySearcher.Service.Domain.csproj VictorySearcher.Service.Domain/
COPY VictorySearcher.Service.Application/VictorySearcher.Service.Application.csproj VictorySearcher.Service.Application/
COPY VictorySearcher.Service.Infrastructure/VictorySearcher.Service.Infrastructure.csproj VictorySearcher.Service.Infrastructure/
COPY VictorySearcher.Service.Api/VictorySearcher.Service.Api.csproj VictorySearcher.Service.Api/

RUN dotnet restore VictorySearcher.Service.Api/VictorySearcher.Service.Api.csproj

COPY . .
RUN dotnet publish VictorySearcher.Service.Api/VictorySearcher.Service.Api.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

RUN mkdir -p /uploads

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "VictorySearcher.Service.Api.dll"]
