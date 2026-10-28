FROM node:24-bookworm-slim
WORKDIR /usr/src/app
COPY . .
RUN npm run build 
CMD ["npm", "run", "start"]