FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /home/node/app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

# Start the server using the production build
CMD [ "node", "/home/node/app/dist/main.js" ]
