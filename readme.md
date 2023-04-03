
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
  node app.js
```

## Running Tests

To run tests, run the following command

```bash

```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

``
DATABASE_NAME=postgres
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
``

## Documentation

./app.js - main file

./database/index.js - database instace

./database/associations.js - tables associations

./database/seed/index.js - seeding entry data to database

./database/seed/data/ - data to seed in csv files

./database/models/ - database models

./database/entities/ - data models
