# Build stage (Node)
FROM node:20-alpine AS build
WORKDIR /app

# Dependency install first (better caching)
COPY package*.json ./
RUN npm ci

# Copy rest and build
COPY . .
RUN npm run build

# Serve stage (nginx)
FROM nginx:1.27-alpine
# SPA routing + cache for assets
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]