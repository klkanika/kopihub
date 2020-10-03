```
docker run --detach --publish 5432:5432 -e POSTGRES_PASSWORD=postgres --name 'plugin-prisma' postgres:12.3
```

```
yarn prisma migrate save --experimental
yarn prisma migrate up --experimental
yarn prisma generate
```

```
yarn dev
```
