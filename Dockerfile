# Stage 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json dan install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy semua source code dan build aplikasi
COPY . ./
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
