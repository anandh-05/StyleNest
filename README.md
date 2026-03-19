# StyleNest

Full-stack eCommerce starter built with React (Vite + Tailwind CSS) on the frontend and Django REST Framework on the backend.

## Stack
- Frontend: React + Vite + Tailwind CSS + React Router + Axios
- Backend: Django + Django REST Framework + Simple JWT
- Database: SQLite in development, PostgreSQL in production via `DATABASE_URL`

## Features
- Product catalog with admin CRUD endpoints
- JWT authentication with register, login, refresh, and current-user endpoints
- LocalStorage cart with quantity updates and removal
- Checkout flow with simulated payment placeholder for Razorpay or Stripe
- Order persistence with order items, shipping details, total price, and order history
- Mobile responsive UI with protected routes and loading/error states

## Folder Structure
```text
my project/
+-- backend/
¦   +-- config/
¦   ¦   +-- settings.py
¦   ¦   +-- urls.py
¦   ¦   +-- asgi.py
¦   ¦   +-- wsgi.py
¦   +-- store/
¦   ¦   +-- management/commands/seed_products.py
¦   ¦   +-- migrations/0001_initial.py
¦   ¦   +-- admin.py
¦   ¦   +-- apps.py
¦   ¦   +-- models.py
¦   ¦   +-- permissions.py
¦   ¦   +-- serializers.py
¦   ¦   +-- urls.py
¦   ¦   +-- views.py
¦   +-- .env.example
¦   +-- manage.py
¦   +-- requirements.txt
+-- frontend/
¦   +-- public/
¦   +-- src/
¦   ¦   +-- components/
¦   ¦   +-- context/
¦   ¦   +-- hooks/
¦   ¦   +-- pages/
¦   ¦   +-- routes/
¦   ¦   +-- services/
¦   ¦   +-- utils/
¦   ¦   +-- App.jsx
¦   ¦   +-- index.css
¦   ¦   +-- main.jsx
¦   +-- .env.example
¦   +-- index.html
¦   +-- package.json
¦   +-- postcss.config.js
¦   +-- tailwind.config.js
¦   +-- vite.config.js
+-- .gitignore
+-- README.md
```

## API Endpoints
### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products` admin only
- `PUT /products/:id` admin only
- `DELETE /products/:id` admin only

### Orders and Payment
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `POST /payments/simulate`

## Backend Setup
1. Create and activate a virtual environment.
```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate
```
2. Install dependencies.
```bash
pip install -r requirements.txt
```
3. Copy environment values if needed.
```bash
copy .env.example .env
```
4. Apply migrations.
```bash
python manage.py migrate
```
5. Create an admin user.
```bash
python manage.py createsuperuser
```
6. Seed sample products.
```bash
python manage.py seed_products
```
7. Start the Django API.
```bash
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend Setup
1. Open a second terminal.
```bash
cd frontend
```
2. Install dependencies.
```bash
npm install
```
3. Copy the frontend env file if you want to override the API URL.
```bash
copy .env.example .env
```
4. Start the Vite dev server.
```bash
npm run dev
```

Frontend runs at `http://127.0.0.1:5173`.

## Production Database
Set `DATABASE_URL` for PostgreSQL before starting Django in production.

Example:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/stylenet_store
```

## Notes
- Product `image` is modeled as a URL-backed field for a clean starter setup without media storage configuration.
- Cart state is persisted in browser localStorage.
- The payment step is intentionally simulated today and ready to be replaced with Razorpay or Stripe server-side logic later.
- The frontend already includes product service methods for admin CRUD integration.

## Verified Locally In This Workspace
- Frontend dependencies installed successfully with `npm install`
- Frontend production build passed with `npm run build`
- Django configuration check passed with `py -3 backend/manage.py check`

## Deployment
Deployment-ready config files are included for:

- Vercel frontend
- Render backend + PostgreSQL
- Railway backend
- Docker Compose

See `DEPLOYMENT.md` for the full setup guide.



