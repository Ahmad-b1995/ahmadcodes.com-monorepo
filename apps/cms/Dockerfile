FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/cms ./apps/cms

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/cms
RUN pnpm build

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/apps/cms/dist ./dist
COPY --from=builder /app/apps/cms/package.json ./package.json

RUN pnpm add -g vite

ENV NODE_ENV=production

EXPOSE 7000

CMD ["vite", "preview", "--port", "7000", "--host", "0.0.0.0"]

