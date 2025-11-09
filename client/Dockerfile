# syntax=docker/dockerfile:1
# Multi-stage image supporting hot-reload dev and optimized production builds

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
# Install devDependencies for build (Vite + plugins live in dev deps)
RUN npm ci --include=dev
COPY . .
ARG VITE_BASE_URL=/api
ARG VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
ARG VITE_CURRENCY='$'
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_TMDB_IMAGE_BASE_URL=${VITE_TMDB_IMAGE_BASE_URL}
ENV VITE_CURRENCY=${VITE_CURRENCY}
RUN VITE_BASE_URL=$VITE_BASE_URL VITE_TMDB_IMAGE_BASE_URL=$VITE_TMDB_IMAGE_BASE_URL VITE_CURRENCY=$VITE_CURRENCY npm run build

FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]