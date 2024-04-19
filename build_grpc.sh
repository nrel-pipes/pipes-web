[ ! -d "/app/src/_proto" ]  && mkdir /app/src/_proto
apk update
apk add protoc protobuf protobuf-dev grpc git
apk add protoc-gen-js --repository https://dl-cdn.alpinelinux.org/alpine/edge/testing
npm i -g protoc-gen-grpc-web
git clone -b $ENV_CONFIG https://github.com/nrel-pipes/pipes-protobufs.git
cp /app/pipes-protobufs/* /app/src/_proto/
cd /app/src/_proto
protoc -I=/app/src/_proto /app/src/_proto/*.proto --js_out=import_style=commonjs:/app/src/_proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:/app/src/_proto
cd /app