FROM node:13.7.0 as base
WORKDIR /usr/src/app
RUN mkdir dist
COPY package.json .

FROM base AS dependencies
RUN npm install

FROM dependencies AS build
COPY . .
RUN npm run build

FROM build as release
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/bin .
EXPOSE 8000/tcp
CMD ["node", "bin/index.js"]