FROM node:13.8.0-alpine3.10
WORKDIR /app
COPY . /app
RUN npm ci --production
USER node
ENTRYPOINT npx /app/bin/pie-my-vulns.js