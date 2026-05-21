# SolarGrid Frontend

This README is only for running the frontend directly on your machine.
For the recommended full-stack setup, use the root `README.md` and Docker Compose.

## Local Frontend Development

From the repository root, create the frontend environment file:

```bash
cp frontend/.env.example frontend/.env.local
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend API URL from `NEXT_PUBLIC_API_URL`.
By default, that is:

```txt
http://localhost:8000
```

Make sure the backend is running before using login, catalog filters, admin pages, or equipment forms.
