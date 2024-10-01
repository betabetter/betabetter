FROM node:16 AS builder

# Create app directory
WORKDIR /app

# Ensure both package.json AND package-lock.json are copied
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:16 as production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 9000
CMD [ "npm", "run", "start:prod" ]