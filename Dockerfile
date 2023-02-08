FROM node:13

RUN mkdir -p /client
WORKDIR /client

COPY . .

#RUN npm install yarn -g

RUN yarn install
RUN yarn add popper.js

# Environment variables
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]
