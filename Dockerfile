FROM node:20-bookworm-slim AS deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml prisma.config.ts ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

FROM node:20-bookworm-slim AS build

WORKDIR /app

ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm?schema=public
ENV JWT_SECRET_KEY=docker-build-secret

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/prisma.config.ts ./prisma.config.ts
COPY --from=deps /app/prisma ./prisma
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN pnpm prisma:generate
RUN pnpm build
RUN pnpm prune --prod

FROM node:20-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN corepack enable

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["pnpm", "start:prod"]
