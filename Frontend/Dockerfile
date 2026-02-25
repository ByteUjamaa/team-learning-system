FROM node:22-alpine  AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build arguments for environment variables
ARG VITE_SERVER_BASE_URL

# This line passes an environment variable into the Docker container so the React app knows the backend API URL.
ENV VITE_SERVER_BASE_URL=$VITE_SERVER_BASE_URL

RUN npm run build

# Stage 2: Nginx, alpine means the lighter version of Nginx
FROM nginx:alpine

# Copy custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]