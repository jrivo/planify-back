# Planify-back

## Commands to execute to launch the project

- Install dependencies

```yarn```

- Run the database

``` docker-compose build -t planify-db ```

``` docker-compose up -d```
- Create a .env file based on the .env.example, containing the database URL

- Apply database structure using prisma

``` cd app```

``` ./refreshPrisma.sh dev```

Here, "dev" is the name of the migration, you can modify it as your convenience.

- Launch the API

``` cd ..```

```npx nodemon server.js```

## Features

- Authentication API

Endpoints :

- /signup :

You must provide :

username

email

password

(role)

- /signin

You must provide :

username

password

You can use the JWT given when connecting to make requests.

## Role testing

There are 3 roles : ADMIN, MODERATOR and USER

You have 3 endpoints to test them :

- /test/all

- /test/admin

- /test/moderator

Put the JWT in the "Authorization" header field.

If you have the rights to access to the endpoint data, verified wih the JWT, it will display. If not, you will get message specifying that you are not authorized.