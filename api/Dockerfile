FROM node:14.5-alpine
ARG DATABASE_URL=postgresql://postgres:postgres@34.87.187.163:5432/kopihub-app
ARG ENV=frontend
ARG PORT=4000
ENV ENV=${ENV}
ENV PORT=${PORT}
ENV DATABASE_URL=${DATABASE_URL}
EXPOSE ${PORT}
EXPOSE 5432
RUN apk add git
WORKDIR /usr/src/app
ADD . .
RUN echo  DATABASE_URL=${DATABASE_URL} > prisma/.env
RUN mkdir uploads
RUN ls -la
RUN rm -rf prisma/migrations
RUN rm -rf yarn.lock
RUN rm -rf package-lock.json
RUN yarn --network-timeout 100000
RUN yarn generate
RUN yarn build
CMD [ "yarn", "start" ]
