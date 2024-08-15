# github-scoring
Backend application for scoring github repositories

## Description
This is a backend application that assigns popularity score to github repositories. The factors that contribute to the score includes stars, forks and the recency of the updates.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

To build the docker image:

```
docker build -t github-scoring .
```

To run the docker image:

```
docker run 3000:3000 github-scoring
```

### Running Redis with Docker

To start the Redis with Docker, you need the Docker app first.

[Docker download page](https://www.docker.com/products/docker-desktop).

In the root directory you will find a "docker-compose.yml" file. Then open a terminal and execute the following command to start the Redis:
```
docker-compose up -d
```
And to close the Redis again:
```
docker-compose down
```