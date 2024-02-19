# Use an official Node.js runtime as a parent image
FROM node:lts-alpine
# Set the working directory in the container
WORKDIR /app

# ... Copying files, installing dependencies ...
COPY ./ /app
RUN apk update && apk add bash
RUN npm install
RUN npm isntall pm2 -g
# Expose the port your app is running on (e.g., 3000)
# EXPOSE 3000

ENTRYPOINT ["pm2-runtime"]
CMD ["start", "./bin/www"]