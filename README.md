# ShopHub — E-Commerce Web App

A full-stack e-commerce demo project:

- **BackEnd/** — ASP.NET Core 8 Web API (raw ADO.NET / `Microsoft.Data.SqlClient`, JWT authentication)
- **FrontEnd/** — React (Vite) + Tailwind CSS single-page app
- **Database** — SQL Server 2022 running in Docker, created and seeded by `BackEnd/Database/init.sql`

---

## Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@shop.com` | `123456` |

The database starts **clean** — no mock products, customers or orders. Only the
admin account is seeded; customers create their own accounts through the
Register form (always with the `Customer` role).

Passwords are stored in the database as **SHA256 hashes (Base64)** — never as plain text.
The admin is redirected to the **Dashboard** after login; customers go to the home page.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+)

---

## How to Run (3 terminals)

### 1. Database (SQL Server in Docker)

```bash
cd BackEnd
docker compose up -d
```

This starts two containers:

- `ecommerce-sqlserver` — SQL Server 2022 on port **1433** (`sa` / `Root@12345`)
- `ecommerce-sqlserver-init` — one-shot helper that waits for SQL Server, runs `Database/init.sql` (creates **ECommerceDB**, 5 tables, and sample data), then exits

`init.sql` is idempotent — it only creates/seeds what does not already exist.

### 2. Backend API

```bash
cd BackEnd
dotnet run --launch-profile http
```

- API: **http://localhost:5184**
- Swagger UI: **http://localhost:5184/swagger** (use the *Authorize* button to paste a JWT token)

### 3. Frontend

```bash
cd FrontEnd
npm install   # first time only
npm run dev
```

- App: **http://localhost:5173**

---

## How Authentication Works

1. `POST /api/auth/login` (or `/register`) checks the SHA256 password hash and returns a **JWT token** + user info.
2. The React app saves the token as `shopToken` in `localStorage` (see `FrontEnd/src/context/AuthContext.jsx`).
3. An axios interceptor (`FrontEnd/src/api.js`) attaches `Authorization: Bearer <token>` to every request.
4. Protected endpoints use `[Authorize]`; admin-only endpoints use `[Authorize(Roles = "Admin")]`.
5. On a `401` response the frontend clears the token and redirects to `/login`.

New registrations are **always** created with the `Customer` role — only an admin can promote a user.

---

## API Overview

| Controller | Route | Purpose |
|---|---|---|
| Auth | `api/auth` | `register`, `login` (returns JWT) |
| Products | `api/products` | Product catalog (public read; admin write) |
| Upload | `api/upload` | Product image upload to Cloudinary (admin) |
| Cart | `api/cart` | Shopping cart of the logged-in user |
| Orders | `api/orders` | Checkout and order history |
| Users | `api/users` | User management (admin) |
| Reports | `api/reports` | Sales/dashboard reports (admin) |

---

## Product Images (Cloudinary)

Product images are hosted on **Cloudinary** (cloud `dsvpykcpj`):

1. In the admin dashboard (**Dashboard → Products → Add/Edit Product**) pick an
   image with the **Upload product image** button.
2. The React app sends the file to `POST api/upload` (admin JWT required,
   JPG/PNG/WEBP/GIF, max 5 MB).
3. The API uploads it to Cloudinary (folder `shophub/products`, auto-resized to
   max 1200×1200) and returns the `https://res.cloudinary.com/...` URL.
4. That URL is saved in the product's `ImageURL` column and used everywhere in
   the shop.

Cloudinary credentials live in `BackEnd/appsettings.json` under the
`Cloudinary` section (CloudName / ApiKey / ApiSecret).

---

## Configuration

- **Connection string & JWT settings:** `BackEnd/appsettings.json`
  (`Server=localhost,1433; Database=ECommerceDB; User Id=sa; Password=Root@12345`)
- **Frontend API base URL:** `FrontEnd/src/api.js` (`http://localhost:5184/api`) — the only place to change it.

---

## Troubleshooting

- **Login fails with correct password after re-seeding:** the `Users` table must contain *hashed* passwords. `init.sql` now seeds the hash directly, but if you ever restore old plain-text data, run `BackEnd/Database/hash-existing-passwords.sql` once against ECommerceDB.
- **Seeding fails with NULL-constraint errors:** the Docker volume holds a stale schema. Reset it with `docker compose down -v && docker compose up -d` (this deletes all data).
- **`address already in use` on port 5184:** an old API instance is still running — find it with `lsof -nP -iTCP:5184 -sTCP:LISTEN` and kill it, then run `dotnet run --launch-profile http` again.
- **Apple Silicon Macs:** the SQL Server image is `linux/amd64` (declared in `docker-compose.yml`); Docker runs it through Rosetta — this is expected.
