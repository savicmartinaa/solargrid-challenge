# SolarGrid Equipment Catalog

SolarGrid is a full-stack equipment catalog for solar products. It includes a FastAPI backend, PostgreSQL database, seed data, authentication with role-based access, and a Next.js frontend for browsing and managing equipment.

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js, React, TypeScript | For the frontend part of the application, I chose Next.js because I already had the most experience working with React, and after using Next.js on one previous project, I found the development experience much cleaner and more practical compared to other frameworks I had tried. It provides built-in routing, better project structure, server-side rendering, and performance optimizations out of the box, which makes development faster and the application easier to scale. Compared to plain React, it requires less manual setup, while compared to frameworks like Angular or Vue.js, it felt like a better balance between flexibility, simplicity, and modern full-stack capabilities for this type of project. |
| Styling/UI | Tailwind CSS, shadcn-style components, lucide-react | For styling and UI development, I used Tailwind CSS together with shadcn-style components and Lucide because they made the development process much faster and more intuitive while still keeping the UI clean and consistent. Since I had already used this stack in previous Next.js projects, I was familiar with the workflow and liked how easy it was to build responsive components without writing large amounts of custom CSS. Technically, Tailwind provides utility-first styling, which improves maintainability and reduces CSS complexity, while shadcn-style components offer reusable and accessible UI primitives that are easy to customize without bringing unnecessary overhead. Lucide-react was a lightweight and modern choice for icons, fitting well with the overall minimal and consistent design approach. |
| Backend | FastAPI | For the backend, I chose FastAPI because I already had previous experience working with both FastAPI and Flask, and from that experience FastAPI felt like the better choice for this project. It significantly speeds up development through automatic request validation with Pydantic models, built-in OpenAPI/Swagger documentation, dependency injection, and a very clean structure with minimal boilerplate code. Compared to Flask, it provides more features out of the box and makes API development more structured and maintainable, especially for larger applications. It also has strong support for asynchronous programming and type hints, which improves readability, scalability, and overall developer experience. |
| ORM | SQLAlchemy 2.0 | For database management, I used SQLAlchemy because I had already worked with it on previous FastAPI projects and found it reliable and flexible for building structured backend applications. It provides a clean way to work with database models through Python code instead of writing large amounts of raw SQL, while still allowing full control over complex queries when needed. SQLAlchemy 2.0 also offers better typed model support and integrates very well with FastAPI, making the codebase easier to maintain and scale. Since the project uses PostgreSQL, SQLAlchemy was a good fit because of its strong PostgreSQL support and mature ecosystem. |
| Migrations | Alembic | For database migrations, I used Alembic because I had previously used it together with FastAPI and SQLAlchemy projects, so it felt like a natural and intuitive choice. It makes database schema changes much easier to manage by keeping migrations versioned and repeatable, which is especially useful as the project grows and the database structure evolves over time. Since Alembic integrates directly with SQLAlchemy models, it simplifies tracking schema changes, reduces the risk of manual database inconsistencies, and makes collaboration and deployment more reliable. |
| Database | PostgreSQL 16 | For the database, I chose PostgreSQL because it is the database I have used most often on previous projects and the one I feel most comfortable working with. It is reliable, stable, and well suited for production applications, especially when working with structured relational data. One of the main reasons I used it in this project was its strong support for JSONB fields, which allowed more flexibility when storing and querying semi-structured data without losing the advantages of a relational database. PostgreSQL also provides features such as strong relational integrity, indexing, enums, and advanced querying capabilities, making it a good balance between flexibility, performance, and maintainability. |
| Auth | JWT in httpOnly cookie | For authentication, I used JWT-based authentication stored in httpOnly cookies because I had already worked with JWT authentication on previous projects and found it to be a good fit for modern API-based applications. Although using JWT instead of traditional session-based authentication was optional in the project requirements, I chose this approach because it allows the backend to remain stateless and simplifies authentication handling between the frontend and backend. I also decided to store the token inside an httpOnly cookie instead of localStorage for additional security, since the cookie cannot be accessed directly through JavaScript, reducing exposure to XSS attacks. Token expiration is handled through JWT expiration claims, which helps improve security by limiting token lifetime and requiring re-authentication when needed. |
| Containers | Docker Compose | For containerization and local environment setup, I used Docker Compose because it provided a much cleaner and more practical way to run the entire application stack. Although it was not a project requirement, I chose it to simplify development and avoid manual setup steps for the frontend, backend, and database. With a single command, all services can be started together in isolated containers with consistent environments and predefined networking, which makes the project easier to run, test, and share across different machines. It also reduces dependency and configuration issues that often appear in local development setups and improves the overall developer experience. |

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

- `dimensions` is stored as JSONB because the value naturally travels through the app as one small object: width, height, and depth. Pydantic still validates that all three fields are present, so the API stays predictable while the database model stays simple.
- `extra_fields` is stored as JSONB because each equipment type can have a different set of extra attributes, and that structure may grow over time. Keeping those values in one flexible object avoids adding many nullable columns that only apply to one product type.
- Equipment listing is ordered by `id` to keep catalog and admin ordering stable after edits. Without an explicit database order, updated rows can appear in a different position.
- Product images can be provided as external URLs or uploaded files. If no image is provided, the frontend falls back to a type-specific default image.
- The small `N` button in the corner is the default Next.js DevTools/development overlay. It can show route and bundler information while running the frontend locally, but it only appears in development mode and is not part of the application UI.
- Manufacturer data is normalized into a separate table and loaded with equipment responses to avoid duplicating manufacturer information across products.
- The backend auto-seeds only when manufacturers are empty. This keeps startup idempotent for local development.
- Docker startup runs migrations automatically for convenience. In a production deployment, migrations would usually run as a separate release step before starting app containers.
- Role-based permissions are enforced in the backend for create, update, and delete operations; the frontend only hides or shows controls for usability.
- JWT is stored in an httpOnly cookie to reduce token exposure to XSS. `sameSite=lax` is used for simple local development; stricter CSRF handling could be added for a broader production surface.
