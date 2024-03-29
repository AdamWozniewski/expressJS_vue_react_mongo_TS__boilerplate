 FROM node:latest

 RUN mkdir -p /app
 WORKDIR /app
 #/usr/src/hooks
 COPY package.json /app
 RUN npm install

 COPY . /app

 EXPOSE 7500

 ENTRYPOINT ["node"]

 CMD ["app.js"]