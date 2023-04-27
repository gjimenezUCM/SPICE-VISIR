FROM node:16-alpine AS build
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package*.json .
RUN npm install
# Copy app files
COPY . .
# Start the app
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
