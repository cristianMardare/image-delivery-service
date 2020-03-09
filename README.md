# Image Delivery Service

A microservice to serve images at different resolutions (developed as part of `Ownzones Node.js Challenge`)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* node.js 12
* npm
* docker

### Installing

* Run `npm ci` to install all dependencies
* Build the code (using Typescript compiler)
```console
$ npm run build
```
* Start the server using `node dist/index.js`
* (Alternatively) combine building and running in one command:
```console
npm start
```
<strong>NOTE:</strong> Start a development server by running:
```console
$ npm run dev:watch
```
It uses [nodemon](https://nodemon.io/) to hot reload on *.ts file changes within the src folder

## Running the tests

* Use `npm run test` or `npx jest` to run all unit / integration tests
* Use specialized scripts to run only one type of tests:
```console
$ npm run test:unit
$ npm run test:integration
```
* Use `npm run test:coverage` or `npx jest --coverage` to generate coverage report
* If you need to hot reload on test changes, run:
```console
$ npm run test:watch
```

### Load tests

Load testing is performed using [artillery](https://artillery.io/docs/)
Use predefined scripts to run different scenarios: 

```console
$ npm run test:load:variant1
```

## Deployment

You can build a Docker image starting from the `Dockerfile`
```console
$ docker build .
```

Then, use [Docker Conpose](https://docs.docker.com/compose/) to run the application
```console
$ docker-compose up
```

## Documentation

To view API docs, you can run the server locally (see #Installing) and navigate to:
```
http://localhost:62226/api/docs
``` 

Alternatively, use the [online swagger editor](https://editor.swagger.io/) to view the docs.
