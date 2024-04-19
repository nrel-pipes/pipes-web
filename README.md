# pipes-web

This project is for PIPES web interface development.

Prerequisites:
* node
* npm
* Docker (optional)
* Docker Compose (optional)


## Local Development

Enter into the project directory, then setup the local development for this project,

First, install js packages into `node_modules`

```bash
$ npm install
```

Second, run the application using `npm`,

```bash
$ npm run start
```

Then visit [`http://127.0.0.1:3000`](http://127.0.0.1:3000)


## Nginx Configuration

Make sure the site could be served by Nginx before moving to deployment, we test by using docker compose.

First, build docker images with nginx,

```bash
$ docker compose build
```

Second, run docker compose,

```bash
$ docker compose up
```

Then visit [`http://127.0.0.1:3030`](http://127.0.0.1:3030).
