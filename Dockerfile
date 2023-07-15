# build environment
#node image
FROM node:lts-bullseye as build
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

#install all packages
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent

#cppy all remaining files
COPY . ./

#build the project
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
