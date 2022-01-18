FROM node:16-buster-slim

RUN npm i -g queuekit-connector-bullmq@latest

ENTRYPOINT ["queuekit-connector-bullmq"]
