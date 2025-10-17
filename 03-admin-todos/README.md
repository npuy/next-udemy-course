# Development

Steps to set up the development environment:

1. Database Setup

```
docker compose up -d
```

This command will start the PostgreSQL database in a Docker container.

2. Create the .env file from .env.template
3. Replace the env variables
4. Execute `npm install`
5. Execute `npm run dev`
6. Execute prisma commands:

   ```
   npx prisma migrate dev
   npx prisma generate
   ```

7. Execute [SEED](localhost:3000/api/seed) to create local data base

# Prisma commands

```
npx prisma init
npx prisma migrate dev
npx prisma generate
```
