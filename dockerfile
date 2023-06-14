FROM node AS base
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install

FROM base AS express-build
COPY tsconfig.json /app/
COPY ./src/ /app/src/
ENTRYPOINT [ "yarn", "entrypoint:express" ]
