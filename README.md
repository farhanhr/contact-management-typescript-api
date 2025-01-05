# Setup Project

1. Create .env file and configure your database

```
DATABASE_URL="mysql://username:mypassword@localhost:3306/databaseName"
```

2. Run these commands in your terminal
```shell

npm install

npx prisma migrate dev

npx prisma generate

npm run build

npm run start

```