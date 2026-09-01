# Arctic Circle Backend — Express + Prisma + PostgreSQL

Rewrite of the original Spring Boot backend. **API contract is intentionally different** —
this was a deliberate redesign, not a port. If you're wiring the frontend to this,
expect to update `src/lib/api.ts` and every route that calls the old endpoints.

## Stack
- Express 5 (plain JavaScript, not TypeScript)
- Prisma ORM → PostgreSQL
- JWT auth (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`)

## Key design changes vs the old Spring Boot version
- **Single `User` table with a `role` field** (`ADMIN` | `CUSTOMER`) instead of separate
  `Admin`/`User` tables. Simpler login (one lookup, not two), simpler seeding.
- **Ticket feedback/rating is now built in** — `rating` and `feedback` fields on `Ticket`,
  settable only after a ticket is `COMPLETED`, only by the ticket's own owner. This was
  a gap in the Spring version (Requirements.docx asked for it, it was never built).
- Enum values are `UPPER_SNAKE_CASE` (`SPLIT`/`WINDOW`, `PLACED`/`DELIVERED`, `AC`/`WASHING_MACHINE`/`FRIDGE`,
  `OPEN`/`COMPLETED`) — different casing from the old Java enums (`Split`, `AC`, `Open`, etc).

## Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in DATABASE_URL, JWT_SECRET, admin credentials
npx prisma migrate dev --name init
npm run seed               # creates the first admin account from .env
npm run dev
```

Server starts on `http://localhost:8081` (configurable via `PORT`).

## Endpoints

### Auth (public)
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password, phone?, address? }` | `{ token, user }` — always `role: "CUSTOMER"` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |

### Users (auth required)
| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/users/me` | — | current user |
| PUT | `/api/users/me` | `{ name?, phone?, address? }` | updated user |
| PUT | `/api/users/me/password` | `{ currentPassword, newPassword }` | `{ message }` |

### Products (public browse, admin write)
| Method | Path | Query / Body | Notes |
|---|---|---|---|
| GET | `/api/products` | `?brand=&type=SPLIT\|WINDOW&sort=` | `sort` = `cost-asc`, `cost-desc`, `rating-desc`, `tonnage`, `brand` |
| GET | `/api/products/:id` | — | single product |
| POST | `/api/products` | `{ brand, modelName, tonnage, starRating, type, price, imageUrl? }` | **admin only** |

### Orders (auth required)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/orders` | `{ productId }` | places order for the logged-in user, status `PLACED` |
| GET | `/api/orders/me` | — | current user's orders |
| GET | `/api/orders` | — | **admin only** — all orders |
| PATCH | `/api/orders/:id/deliver` | — | **admin only** — sets status `DELIVERED` |

### Sales reporting (admin only)
| Method | Path | Query | Returns |
|---|---|---|---|
| GET | `/api/sales/summary` | `?from=&to=` (ISO dates, optional) | `{ totalSales, totalRevenue, byStatus }` |
| GET | `/api/sales/by-product` | `?from=&to=` | array of `{ productId, brand, modelName, unitsSold, revenue }`, sorted by revenue desc |
| GET | `/api/sales/by-brand` | `?from=&to=` | array of `{ brand, unitsSold, revenue }`, sorted by revenue desc |

Derived from `Order` rows (every order counts as a sale, regardless of `PLACED`/`DELIVERED` status) joined to the product's current price — not a separate sales table. This is distinct from the product catalog above: `/api/products` is what the storefront's Sales page browses, `/api/sales/*` is revenue/units reporting for the admin dashboard.

### Tickets / Services (auth required)
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/api/tickets` | `{ appliance, complaint?, address, preferredTimings }` | `appliance` = `AC`, `WASHING_MACHINE`, `FRIDGE` |
| GET | `/api/tickets/me` | — | current user's tickets |
| GET | `/api/tickets` | — | **admin only** — all tickets |
| PATCH | `/api/tickets/:id/complete` | — | **admin only** — sets status `COMPLETED` |
| POST | `/api/tickets/:id/feedback` | `{ rating (1-5), feedback? }` | owner only, only once ticket is `COMPLETED` |

All authenticated routes expect `Authorization: Bearer <token>`.

## What's NOT done yet
- No route for admin to edit/delete a product once created.
- No pagination on `/api/products`, `/api/orders`, `/api/tickets` — fine at low volume, revisit if the catalogue/order history grows.
- No rate limiting / request validation library (Zod, etc.) — inputs are checked manually per-field.
- Frontend (`src/lib/api.ts`, `auth-context.tsx`, and every route file previously wired to
  the Spring Boot API) has **not** been updated to this new contract yet.
