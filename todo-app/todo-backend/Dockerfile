FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

COPY . .

RUN npm ci --omit=dev

ENV DEBUG=todo-express-backend:*

USER node

CMD npm start