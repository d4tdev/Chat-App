FROM node:20.11.1
WORKDIR /chat-app
ADD . .
RUN npm install -g pnpm
RUN pnpm install
CMD ["pnpm", "run", "start"]
