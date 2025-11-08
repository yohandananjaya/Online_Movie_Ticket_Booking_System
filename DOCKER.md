# Docker & Deployment Guide

This project ships with Docker recipes for both iterative development and production-ready deployment. The sections below explain how everything is wired together and list the exact commands to run in each scenario.

## 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 4.30 or newer with WSL 2 integration enabled on Windows.
- Optional but recommended: [Docker Buildx](https://docs.docker.com/build/install-buildx/) (bundled with recent Docker Desktop releases).
- A `.env` file inside `client/` defining `VITE_BASE_URL` and `VITE_TMDB_IMAGE_BASE_URL` for local development. Sample values already exist in `client/.env`.

## 2. Development Workflow

The default `compose.yml` spins up MongoDB, the Express API with hot reload (via Nodemon), and the Vite dev server.

```powershell
cd "c:\Users\USER\Desktop\DevOps Project\Online_Movie_Ticket_Booking_System"
docker compose up --build
```

- Frontend: http://localhost:3000 (Vite dev server)
- Backend API: http://localhost:5000
- MongoDB: exposed on port 27017

Code changes on the host instantly propagate into the containers thanks to bind mounts. Node dependencies live inside anonymous volumes so you never have to install them on the host.

To stop the stack:

```powershell
docker compose down
```

Add `--volumes` if you want to wipe Mongo data that persists between runs.

## 3. Production Build & Test Locally

Use the dedicated production file to build optimized images (Express running with `npm start`, frontend pre-built and served through Nginx).

```powershell
# Build & start the production stack
cd "c:\Users\USER\Desktop\DevOps Project\Online_Movie_Ticket_Booking_System"
docker compose -f compose.prod.yml up --build -d

# Tail logs if needed
docker compose -f compose.prod.yml logs -f backend
docker compose -f compose.prod.yml logs -f frontend
```

Access the SPA at http://localhost:8080. All `/api` requests are reverse-proxied by Nginx to the backend container. When you are done:

```powershell
docker compose -f compose.prod.yml down
```

> **Security tip:** `compose.prod.yml` maps MongoDB (27017) and the API (5000) to the host for local smoke-testing. Remove those `ports` entries before deploying to a public server.

## 4. Customising Build-Time Values

The production frontend is compiled ahead-of-time, so API URLs must be provided at build time.

```powershell
$env:VITE_BASE_URL = "https://api.example.com"
docker compose -f compose.prod.yml build frontend
```

The Dockerfile exposes these args:

- `VITE_BASE_URL` (defaults to `/api`)
- `VITE_TMDB_IMAGE_BASE_URL` (defaults to the TMDB original image endpoint)
- `VITE_CURRENCY` (defaults to `$`)

Backend secrets (e.g. Cloudinary API keys) should be injected via environment variables. Extend `compose.prod.yml` or use `.env` files as needed.

## 5. Continuous Integration / Continuous Delivery (CI/CD)

A GitHub Actions workflow (`.github/workflows/docker.yml`) builds and optionally publishes both images. Configure these GitHub secrets before enabling pushes to a registry:

- `REGISTRY` – e.g. `ghcr.io`
- `REGISTRY_USERNAME` – the registry username (GitHub username when using GHCR)
- `REGISTRY_PASSWORD` – a Personal Access Token with `write:packages` scope

The workflow tags images as `${REGISTRY}/${REGISTRY_USERNAME}/movie-booking-backend` and `${REGISTRY}/${REGISTRY_USERNAME}/movie-booking-frontend`. Adjust the names or add deployment steps (e.g. pushing to a server, triggering a platform deploy) as required.

Trigger the workflow manually once secrets are defined:

```text
GitHub → Actions → "Build & Push Docker Images" → Run workflow
```

## 6. Deploying the Images

Where you deploy will dictate the final steps. Two common paths:

1. **Docker Swarm / Compose on a VM** – copy `compose.prod.yml`, update environment variables, and run `docker compose up -d` on the target host.
2. **Kubernetes** – create Deployment and Service manifests referencing the published images. MongoDB can remain a managed service or be replaced with Atlas.

Remember to provide production-grade secrets (`MONGODB_URI`, JWT keys, Cloudinary credentials) via environment variables or secret managers on the target platform.

---

If you need tailored instructions for a specific host (AWS ECS, Azure Web Apps for Containers, Render, etc.) let me know which platform and I can extend this guide.
