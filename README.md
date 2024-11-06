# pipes-web

Technology stack:
* node
* npm
* react

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

* Release via `release` branch.
* Merge `release` into `develop` and `master` branches.


## Deployment

1. Build docker image

AWS Codebuild and webhook has been setup on this repo, triggering by

* pull request create
* pull request update
* pull request reopen

on base branch `develop` and `master`.


2. Deploy the image

Deploy via Jenkins job named `pipes-web` - https://jenkins.stratus.nrel.gov/job/pipes-web/


```[css]
.dark-blue {
  color: rgb(53, 107, 192);
}

.light-blue {
  color: rgb(71, 148, 218);
}

.orange {
  color: rgb(227, 140, 48);
}
.yellow {
  color: rgb(238, 180, 50);
}
.dark-green {
  color: rgb(88, 137, 55);
}

.light-green {
  color: rgb(134, 186, 69);
}

.light-green {
  color: rgb(134, 186, 69);
}
.light-green {
  color: rgb(134, 186, 69);
}
.charcoal {
  color: rgb(67, 78, 90);
}

.gray {
  color: rgb(192, 198, 202);
}

.maroon {
  color: rgb(94, 32, 25);
}

.red {
  color: rgb(179, 63, 48);
}
```