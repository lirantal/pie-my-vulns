FROM node:12.16.2-alpine3.9
WORKDIR /app
COPY . /app
RUN npm ci --production
USER node
ENTRYPOINT node ./bin/pie-my-vulns.js --directory=/tmp/tested-app
