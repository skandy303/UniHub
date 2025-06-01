FROM node:18-alpine

WORKDIR /usr/frontend/

COPY . .

RUN npm i

ENV NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 3000

ENTRYPOINT ["npm", "start"]