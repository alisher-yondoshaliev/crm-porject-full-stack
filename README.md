# CRM Project API

NestJS + Prisma + PostgreSQL asosidagi CRM backend.

## Local Setup

```bash
pnpm install
pnpm prisma:generate
pnpm build
pnpm start:dev
```

Kerakli environment variable'lar uchun `.env.example` faylidan foydalaning.

## Available Scripts

```bash
pnpm build
pnpm prisma:generate
pnpm lint
pnpm lint:check
pnpm test
pnpm test:ci
pnpm db:seed
pnpm start:dev
pnpm start:prod
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

CI quyidagilarni bajaradi:

- `pnpm install --frozen-lockfile`
- `pnpm prisma:generate`
- `pnpm lint:check`
- `pnpm test:ci`
- `pnpm build`

Triggerlar:

- `push` to `main`
- `push` to `develop`
- har qanday `pull_request`

CI dummy `DATABASE_URL` va `JWT_SECRET_KEY` bilan ishlaydi, chunki build jarayoni uchun real baza shart emas.

## CD

GitHub Actions workflow: `.github/workflows/cd.yml`

CD quyidagilarni bajaradi:

- DigitalOcean App Platform service uchun yangi deployment trigger qiladi
- service latest source yoki image bilan qayta deploy bo'ladi

Triggerlar:

- `push` to `main`
- `v*` formatdagi tag push
- manual `workflow_dispatch`

## Docker

Lokal build:

```bash
docker build -t crm-project .
```

Lokal run:

```bash
docker run --rm -p 3001:3001 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/crm?schema=public" \
  -e JWT_SECRET_KEY="change-me" \
  -e PORT=3001 \
  crm-project
```

## GitHub Secrets

`cd.yml` to'liq ishlashi uchun quyidagi repository secretlar kerak bo'ladi:

- `DIGITALOCEAN_ACCESS_TOKEN`
- `DIGITALOCEAN_APP_ID`

Eslatma:

- Agar shu ikki secret bo'lmasa, deploy step skip bo'ladi.
- `DATABASE_URL`, `JWT_SECRET_KEY`, `PORT` va boshqa production env qiymatlarini DigitalOcean App Platform ichida saqlang.

## DigitalOcean Notes

- Bu workflow DigitalOcean App Platform uchun moslangan.
- App allaqachon DigitalOcean ichida yaratilgan bo'lishi kerak.
- `DIGITALOCEAN_APP_ID` sifatida o'sha app/service ID ishlatiladi.
- Workflow `doctl apps create-deployment --update-sources --wait` orqali deploy boshlaydi.
- Agar siz Droplet emas, App Platform ishlatayotgan bo'lsangiz, shu variant to'g'ri keladi.

## Seed

SUPERADMIN yaratish:

```bash
pnpm db:seed
```

Buning uchun quyidagilar kerak:

- `DATABASE_URL`
- `SUPERADMIN_EMAIL`
- `SUPERADMIN_PASSWORD`

Opsional:

- `SUPERADMIN_FULL_NAME`
- `SUPERADMIN_POSITION`
