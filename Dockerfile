FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm run build 
CMD npm run start