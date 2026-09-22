FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY vercel.json /usr/share/nginx/html/vercel.json
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
