FROM node:10-alpine
WORKDIR /src/app
COPY . .
RUN npm install
EXPOSE 3300
ENV NODE_ENV=production
CMD ["node", "index.js"]