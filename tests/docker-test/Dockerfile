FROM node:18-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 3000

FROM base as prod
ENV NODE_ENV=prod
RUN npm ci --production
COPY . ./

FROM base as dev
ENV NODE_ENV=dev
RUN npm install -g nodemon && npm install
COPY . ./

FROM base as qc
ENV NODE_ENV=qc
RUN npm ci --production
COPY . ./