# Setup

To develop you need to have `node.js`, `protoc`, and `protoc-gen-grpc-web` plugin installed on your local machine. (Installing these dependencies is not covered here.)

After cloning the repo and entering the main directory run the following to download the dependencies of the node app:
`npm install`

# Communicating with PIPES Server
In order for the UI to communicate with the GRPC PIPES server, there needs to be a web proxy that converts HTTP/2 messages to HTTP/1.1
We use [this](https://github.com/improbable-eng/grpc-web/tree/master/go/grpcwebproxy) proxy for this purpose.


# Develop Version

This workflow is for development purposes.
First, make sure the protobuf submodule is up to date:

`git submodule update --init --recursive`

Then build the protobuf files:

`bash build_grpc.sh`

To launch the app run:

`npm run start`

## Updating Graph Database

To update your graph with the latest features in `pipes-core` and `pipes-client` do the following:

Start the `pipes-core` server

Run `reset_graph.sh`

From the `pipes-client` directory run:

```bash
pipes project create-project -f tests/data/templates/test_project.toml


pipes model create-model-run -p test1 -r 1 -m dsgrid -f tests/data/templates/test_model_run.toml


pipes dataset checkin-dataset -p test1 -r 1 -m dsgrid -x model-run-1 -f tests/data/templates/test_dataset.toml


pipes handoff submit-tasks -p test1 -r 1 -m dsgrid -x model-run-1 -f tests/data/templates/test_qaqc.toml --task-pass


pipes handoff submit-tasks -p test1 -r 1 -m dsgrid -x model-run-1 -f tests/data/templates/test_vis.toml --task-pass

pipes handoff submit-tasks -p test1 -r 1 -m dsgrid -x model-run-1 -f tests/data/templates/test_transformation.toml -d tests/data/templates/test_transformed_dataset.toml --task-pass
```

# Production Version

To create a production build of the app do the following from the base directory:

```
bash build_grpc.sh
npm run build
```

To run an already created production build of the app do the following:

```
docker compose build
docker compose up
```

Then navigate to `localhost:3005` on your machine.

Once the first version of the app is rolled out we can separate the production and develop versions.

# Stratus docker

## Stratus AWS frontend architecture

### Angular Docker Deployment with AWS CodeBuild

This project utilizes AWS CodeBuild to automatically build Docker images based on specific environments. The build process is orchestrated through a `buildspec.yml` file located in the `awscodebuild` folder. This, in turn, leverages a `Makefile`, that builds `Dockerfile-prod`. To locally simulate the production image build, you can execute the command:
```bash
export AWS_ACCOUNT_ID=991404956194; export ENVIRONMENT='production'; make -f Makefile build
