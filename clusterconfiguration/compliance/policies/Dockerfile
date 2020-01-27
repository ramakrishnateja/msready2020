FROM node:13.7.0
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
COPY --from=dependencies /usr/src/app/dist .
EXPOSE 8080
CMD ["node", "dist/index.js"]