# Deployment Guide

This repository is prepared for the following production paths:

- Frontend on Vercel
- Backend API on Render
- Backend API on Railway
- Full stack with Docker Compose

The backend now includes:

- WhiteNoise static file serving for Django admin and static assets
- Gunicorn for production app serving
- Environment-driven CORS, CSRF, hosts, and HTTPS settings
- A health check endpoint at `/health`

## Required Environment Variables

### Backend

| Variable | Purpose | Local default |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Django secret key | `django-insecure-change-me` |
| `DJANGO_DEBUG` | Debug toggle | `True` |
| `DJANGO_ALLOWED_HOSTS` | CSV list of Django allowed hosts | `127.0.0.1,localhost` |
| `DATABASE_URL` | SQLite or PostgreSQL connection string | `sqlite:///db.sqlite3` |
| `CORS_ALLOW_ALL_ORIGINS` | Allow all origins in dev only | `True` |
| `CORS_ALLOWED_ORIGINS` | CSV list of allowed frontend origins | local Vite URLs |
| `CORS_ALLOWED_ORIGIN_REGEXES` | Regex allowlist for preview domains | empty |
| `CSRF_TRUSTED_ORIGINS` | CSV list of trusted origins for admin or session POSTs | local Vite URLs |
| `SESSION_COOKIE_SECURE` | Secure session cookie flag | `False` |
| `CSRF_COOKIE_SECURE` | Secure CSRF cookie flag | `False` |
| `DJANGO_SECURE_SSL_REDIRECT` | Force HTTPS redirects | `False` |
| `DJANGO_SECURE_HSTS_SECONDS` | HSTS max age | `0` |
| `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS` | HSTS subdomains flag | `False` |
| `DJANGO_SECURE_HSTS_PRELOAD` | HSTS preload flag | `False` |
| `WEB_CONCURRENCY` | Gunicorn workers | `2` |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Public base URL of the deployed backend API |

## Vercel Frontend

1. Create a new Vercel project from this repository.
2. Set the Vercel project Root Directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your deployed backend URL, for example `https://stylenest-api.onrender.com`.
6. Deploy.

`frontend/vercel.json` already adds the SPA rewrite needed for React Router refreshes.

## Render Backend

This repo includes a root `render.yaml` Blueprint.

1. In Render, create a new Blueprint and connect this repository.
2. Render will provision the `stylenest-api` web service and `stylenest-db` PostgreSQL database.
3. During setup, provide values for the prompted variables:
   - `CORS_ALLOWED_ORIGINS`: your Vercel production URL, such as `https://stylenest.vercel.app`
   - `CSRF_TRUSTED_ORIGINS`: your frontend URL and any backend custom domain if needed
4. After the first deploy, open the Render shell and run `python manage.py seed_products` if you want demo catalog data.

The service uses `/health` as its health check path.

## Railway Backend

This repo includes a root `railway.json` config-as-code file.

1. Create a new Railway project from this repository.
2. Add a PostgreSQL service.
3. In the backend service, use the repository root so Railway picks up the root `railway.json` file.
4. Add these backend variables:
   - `DJANGO_SECRET_KEY`: a strong random secret
   - `DJANGO_DEBUG=False`
   - `DATABASE_URL`: reference the Railway Postgres connection string
   - `DJANGO_ALLOWED_HOSTS=.up.railway.app`
   - `CORS_ALLOW_ALL_ORIGINS=False`
   - `CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app`
   - `CORS_ALLOWED_ORIGIN_REGEXES=^https://.*\\.vercel\\.app$`
   - `CSRF_TRUSTED_ORIGINS=https://your-vercel-domain.vercel.app,https://*.up.railway.app`
   - `SESSION_COOKIE_SECURE=True`
   - `CSRF_COOKIE_SECURE=True`
   - `DJANGO_SECURE_SSL_REDIRECT=True`
   - `DJANGO_SECURE_HSTS_SECONDS=31536000`
   - `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=True`
   - `DJANGO_SECURE_HSTS_PRELOAD=True`
5. After deployment, run `python manage.py seed_products` once if you want demo data.

## Docker Compose

A production-style Docker setup is included:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `docker-compose.yml`

Run it locally with:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`
- PostgreSQL: internal Docker network only

Before using Docker in any real environment, change the default values in `docker-compose.yml`, especially:

- `DJANGO_SECRET_KEY`
- Postgres password
- `VITE_API_URL` if your frontend is not served from `localhost`

## Suggested First Production Flow

1. Deploy backend first on Render or Railway.
2. Copy the backend public URL.
3. Deploy frontend on Vercel with `VITE_API_URL` set to that backend URL.
4. Update backend CORS and CSRF values to match the final Vercel domain.
5. Seed demo data if needed.

## Official Docs

- Vercel rewrites: https://vercel.com/docs/routing/rewrites
- Render Blueprints: https://render.com/docs/infrastructure-as-code
- Render Blueprint spec: https://render.com/docs/blueprint-spec
- Railway config as code: https://docs.railway.com/config-as-code
- Railway monorepo guide: https://docs.railway.com/guides/monorepo
