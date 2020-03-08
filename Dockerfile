FROM node:12.14.1

# create root folder
WORKDIR /usr/image_delivery_service

# install dependencies first (changes here are uncommon) 
COPY package*.json ./
RUN npm ci --production

# copy source files
COPY . .

# build the app (i.e. compile typescript file)
RUN npm run build

# run the application
CMD ["node", "dist/index.js"]

# expose port
EXPOSE 62226