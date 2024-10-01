FROM node:16 AS base

# Create app directory
WORKDIR /app

# Ensure both package.json AND package-lock.json are copied
COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

FROM base as production
CMD [ "npm", "run", "build" ]

FROM base as dev
CMD ["npm", "run", "dev"]