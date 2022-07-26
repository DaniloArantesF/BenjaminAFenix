# State 0
FROM node:16 as build

WORKDIR /client

COPY package*.json ./
RUN npm install

# Copy source code to container
COPY . .

RUN npm run build

ENV PORT=3000
EXPOSE 3000

# Stage 1
FROM nginx:stable-alpine as nginx

# Set working dir to nginx asset directory
WORKDIR /usr/share/nginx/html

# Replace static assets
RUN rm -rf ./*
COPY --from=build /client/build .

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]