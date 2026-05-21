# SolarGrid Equipment Catalog

SolarGrid is a full-stack equipment catalog for solar products. It includes a FastAPI backend, PostgreSQL database, seed data, authentication with role-based access, and a Next.js frontend for browsing and managing equipment.

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js, React, TypeScript | Modern full-stack React framework with typed UI code and good local developer experience. |
| Styling/UI | Tailwind CSS, shadcn-style components, lucide-react | Fast, consistent UI development with accessible primitives and lightweight icons. |
| Backend | FastAPI | Built-in OpenAPI docs, Pydantic validation, dependency injection, and low boilerplate API development. |
| ORM | SQLAlchemy 2.0 | Mature Python ORM with typed model support and PostgreSQL features. |
| Migrations | Alembic | Standard migration tool for SQLAlchemy; keeps schema changes versioned and repeatable. |
| Database | PostgreSQL 16 | Relational integrity, JSONB support, enums, indexes, and production-ready behavior. |
| Auth | JWT in httpOnly cookie | Stateless auth while preventing JavaScript access to the token. |
| Containers | Docker Compose | One-command local setup for backend, frontend, and database. |

## Requirements

- Docker and Docker Compose
- Optional for local-only development:
  - Python 3.12
  - Node.js 22+
  - PostgreSQL 16

## Environment Files

Create local environment files from the committed examples before running the app.
Real `.env` files are intentionally ignored by Git.

For Docker Compose from the project root:

```bash
cp .env.example .env
```

For local frontend development:

```bash
cp frontend/.env.example frontend/.env.local
```

For local backend development outside Docker:

```bash
cp backend/.env.example backend/.env
```

Update the copied values if your local ports, database credentials, or API URL differ.

## Run With Docker

From the project root:

```bash
docker compose up --build
```

The app will be available at:

```txt
Frontend: http://localhost:3000
Backend API: http://localhost:8000
Swagger docs: http://localhost:8000/docs
```

On backend startup, Docker runs:

```bash
alembic upgrade head
```

Then the app seeds the database from `seed-data.json` if the database is empty.

To reset the database and start from fresh seed data:

```bash
docker compose down -v
docker compose up --build
```

## Install And Run Locally

Docker is the recommended setup. If running services manually, install dependencies separately.

Backend:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python seed.py
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at:

```txt
http://localhost:8000
```

There is also a short `frontend/README.md` with frontend-only local development notes.

## Migrations

Apply migrations:

```bash
docker compose run --rm backend alembic upgrade head
```

Check current migration:

```bash
docker compose run --rm backend alembic current
```

Check whether models and database schema are in sync:

```bash
docker compose run --rm backend alembic check
```

Create a new migration after changing SQLAlchemy models:

```bash
docker compose run --rm backend alembic revision --autogenerate -m "describe change"
```

Review generated migration files before applying them.

## Tests

Run backend tests:

```bash
docker compose run --rm backend pytest
```

Run frontend linting:

```bash
docker compose run --rm frontend npm run lint
```

## Seed Users

Seed users are defined in `seed-data.json`.

| Email | Password | Role |
|-------|----------|------|
| admin@solargrid.example.com | admin123 | admin |
| editor@solargrid.example.com | editor123 | editor |
| viewer@solargrid.example.com | viewer123 | viewer |

## Assumptions And Trade-Offs

- `dimensions` is stored as JSONB even though it always contains `w`, `h`, and `d`. This keeps the API shape close to the seed data while Pydantic enforces the response/request structure.
- `extra_fields` is stored as JSONB because different equipment types need different extra attributes, and those fields are currently display-oriented rather than heavily queried.
- The backend auto-seeds only when manufacturers are empty. This keeps startup idempotent for local development.
- Docker startup runs migrations automatically for convenience. In a production deployment, migrations would usually run as a separate release step before starting app containers.
- JWT is stored in an httpOnly cookie to reduce token exposure to XSS. `sameSite=lax` is used for simple local development; stricter CSRF handling could be added for a broader production surface.
