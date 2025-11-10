# Correr en dev

1. Clonar el repositorio.
2. Crear una copia del `.env.template` y renombrarlo a `.env` y cambiar las variables de entorno.
3. Instalar dependencias `npm install`
4. Levantar la base de datos `npm run prisma:up`
5. Correr las migraciones de Prisma `npm run prisma:migrate`
6. Ejecutar seed `npm run prisma:seed`
7. Limpiar LocalStorage del navegador.
8. Correr el proyecto `npm run dev`
