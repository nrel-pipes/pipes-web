ARG BASE_IMAGE_TAG AWS_ACCOUNT_ID ENV_CONFIG VERBOSE
# Build the node app
FROM node:21-alpine AS build

ARG BASE_IMAGE_TAG AWS_ACCOUNT_ID ENV_CONFIG VERBOSE

ENV ENV_CONFIG="${ENV_CONFIG}" REACT_APP_ENV="${ENV_CONFIG}"

WORKDIR /app

# COPY package.json package-lock.json ./
COPY package.json package-lock.json ./
COPY public/ /app/public/
copy src/ /app/src/

RUN echo "REACT_APP_ENV value is: ${REACT_APP_ENV}" && \
    if [ "$VERBOSE" = "true" ]; then \
    npm install && npm run build --loglevel verbose; \
else \
    npm run build; \
fi

# Serve using NGINX
ARG BASE_IMAGE_TAG AWS_ACCOUNT_ID
FROM ${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/nrel-split-nginx:${BASE_IMAGE_TAG}
ARG ENV_CONFIG

ENV NGINX_BACKEND_HOST="html" \
NGINX_VHOST_PRESET="html" \
NGINX_SERVER_ROOT="/var/www/html/web" \
NGINX_MOREHEADERS_ENABLED="on" \
REACT_APP_ENV=$ENV_CONFIG

USER root

WORKDIR /var/www/html

# Copy everything from project root into html container's working dir
COPY --from=build --chown=wodby:wodby /app/build web/

USER wodby
