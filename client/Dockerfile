FROM node:16-alpine

# next two are specific to serving create-react-app in docker container
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app

COPY ./ ./

CMD ["npm", "start"]

