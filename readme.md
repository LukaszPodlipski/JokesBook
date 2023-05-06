# JokesBook

Simple app to share jokes :)

## Run Locally

Clone the project

```bash
  git clone https://github.com/LukaszPodlipski/jokesbook.git
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

Start the server with dropping database

```bash
  npm start:drop
```

Start the server with seeding database

```bash
  npm start:seed
```

Start the server with dropping and seeding database

```bash
  npm start:reset
```

## Running Tests

To run tests, run the following command

```bash
npm test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

DATABASE_NAME=postgres

DATABASE_NAME_TEST=postgres-test  - for testing

DATABASE_USERNAME=postgres_username

DATABASE_PASSWORD=postgres_password

SECRET_KEY=your_secret_key_for_jwt-auth

## Documentation

./app.ts - main file

./server.ts - server start / stop functions

./config.ts - server config functions

./__tests__/ - tests files

./database/index.ts - database instace

./database/associations.ts - tables associations

./database/seed/index.ts - seeding entry data to database

./database/seed/data/ - data to seed in csv files

./database/models/ - database models

./database/entities/ - data models

./controllers/ - all controllers

./controllers/utils/index.ts - utility functions used in controllers

./controllers/validatorsSchemas/index.ts - YUP validation functions for request data

./routes/ - all routes
