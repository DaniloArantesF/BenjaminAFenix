FROM node:16

WORKDIR /client

COPY package*.json ./
RUN npm install

# Copy source code to container
COPY . .

ENV PORT=3000
EXPOSE 3000

