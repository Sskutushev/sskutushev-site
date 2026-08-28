FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile=false
COPY prisma prisma
COPY apps/api apps/api
RUN pnpm prisma:generate && pnpm --filter @sskutushev/api build
FROM node:22-alpine
RUN corepack enable
WORKDIR /app
COPY --from=build /app /app
USER node
EXPOSE 4000
CMD ["pnpm", "--filter", "@sskutushev/api", "start"]
