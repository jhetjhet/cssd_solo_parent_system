FROM node:18-alpine AS development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Enable polling-based file watching so hot reload works inside Docker on Linux
ENV WATCHPACK_POLLING=true

CMD ["npm", "start"]

FROM node:18-alpine AS production

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=production /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]