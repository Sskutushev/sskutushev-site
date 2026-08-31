FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
RUN --mount=type=cache,id=pnpm-web,target=/pnpm/store \
  pnpm config set store-dir /pnpm/store && pnpm install --filter @sskutushev/web... --frozen-lockfile
COPY apps/web apps/web
# The build copies the resume into dist and fails loudly when it cannot find
# it, so the image context has to carry it. A missing file here is the dead
# download link the check exists to prevent.
COPY infrastructure/assets infrastructure/assets
ARG VITE_GRAPHQL_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
RUN pnpm --filter @sskutushev/web build
FROM nginx:1.27-alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY infrastructure/docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
