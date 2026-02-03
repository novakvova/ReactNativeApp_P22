# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source

# Копіюємо проект і відновлюємо залежності
COPY ["JustDoItApi/JustDoItApi.csproj", "JustDoItApi/"]
RUN dotnet restore "JustDoItApi/JustDoItApi.csproj"

# Копіюємо всі файли і будуємо додаток
COPY . .
WORKDIR /source/JustDoItApi
RUN dotnet publish -c Release -o /app

# Stage 2: Final image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0

RUN apt-get update && apt-get install -y \
    libkrb5-3 \
    libgssapi-krb5-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копіюємо додаток з етапу побудови
COPY --from=build /app .

# Запускаємо додаток
ENTRYPOINT ["dotnet", "JustDoItApi.dll"]
