# pipes-web

Technology stack:

- node
- npm
- react

## Development

Clone this repository and enter into `pipes-web` directory.

Install node modules

```bash
$ npm install
```

Start development server

```bash
$ npm run start
```

Builds the app for production to the `build` folder.

```bash
$ npm run build
```

## Release

The release workflow is this:

- Release via `release` branch.
- Merge `release` into `develop` and `master` branches.
- Create semantic tags and release logs.


## Deployment

1. Build docker image

AWS Codebuild and webhook has been setup on this repo, triggering by

- pull request create
- pull request update
- pull request reopen

on base branch `develop` and `master`.

2. Deploy the site

Deploy via Jenkins job named `pipes-web` at NREL.
