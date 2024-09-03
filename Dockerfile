FROM node:21-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN npm run build

FROM nginx:1.21.0-alpine AS nginx

ENV NODE_ENV development
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/${NODE_ENV}.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
