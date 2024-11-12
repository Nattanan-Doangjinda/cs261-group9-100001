FROM node:18

WORKDIR /usr/src/app/backend

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

EXPOSE 8000

CMD ["node", "server.js"]
