FROM node:18

RUN npm i -g pnpm

COPY pnpm-lock.yaml package.json ./

ADD . ./

RUN npm pkg delete scripts.prepare && \ 
    pnpm install --frozen-lockfile

RUN pnpm build

EXPOSE 3000
CMD [ "pnpm", "start" ]