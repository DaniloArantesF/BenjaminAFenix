FROM node:16

WORKDIR /backend

# Cache dependencies
COPY package*.json ./
RUN npm install

# Copy source code to container
COPY . .

ENV PORT=3016
EXPOSE 3016

RUN npm install -g typescript
RUN tsc

CMD ["node", "./dist/index.js"]
