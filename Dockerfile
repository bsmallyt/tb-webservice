# Config Variables
ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=alpine-perl

#######################################
# Build Angular App
#######################################
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Copy dependency files first
COPY ./trulyben/package*.json ./

# Clean install
RUN npm ci

# Copy source files
COPY ./trulyben .

# Build the app
RUN npx ng build --configuration production


#######################################
# Serve with nginx
#######################################
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

ARG PROJECT_NAME=trulyben

USER nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf  

# Copy built server
COPY --chown=nginx:nginx --from=builder /app/www /usr/share/nginx/html

EXPOSE 8080

# Serve with nginx
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]