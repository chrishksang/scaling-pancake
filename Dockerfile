FROM node:18.12-alpine AS base
RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app
WORKDIR /usr/src/node-app
COPY --chown=node:node package.json yarn.lock ./
USER node
ENV NODE_ENV production
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
ENTRYPOINT ["node", "index.js"]
