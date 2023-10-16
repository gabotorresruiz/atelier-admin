# atelier-admin

# Start App in Docker Container (Dev)

1. Crear la network frontend (en caso de que no esté creada)

```
docker network create frontend
```

2. Ejecutar el siguiente comando

```
docker compose -f docker-compose.dev.yml up -d --build
```

# Start App in Docker Container (Prod)

```
docker compose up -d --build
```
