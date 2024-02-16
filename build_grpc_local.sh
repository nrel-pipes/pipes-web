[ ! -d "src/_proto" ]  && mkdir src/_proto
cp ./pipes-protobufs/* src/_proto/
protoc -I=src/_proto ./src/_proto/*.proto --js_out=import_style=commonjs:src/_proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/_proto
export REACT_APP_ENV="dev"
