FROM node:22-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN npm run build

FROM nginx:1.27-alpine AS nginx

ENV NODE_ENV development
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/${NODE_ENV}.conf /etc/nginx/conf.d/default.conf

# Remove gotpl, as it has vulnerabilities.
RUN rm -f /usr/local/bin/gotpl

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
