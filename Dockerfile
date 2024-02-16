FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN npm run build
#COPY ["./build","./build"]
#COPY ["./public","./public"]
#COPY ["./app.js","./app.js"]
FROM nginx:1.21.0-alpine as production-app
# VOLUME /certs
ENV NODE_ENV development
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx-${NODE_ENV}.conf /etc/nginx/conf.d/default.conf
# expose 80 because that's production port for node
EXPOSE 80 
# EXPOSE 8080 # this was for connecting to grpc proxy server locally
CMD ["nginx", "-g", "daemon off;"]
