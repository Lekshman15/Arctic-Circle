# Arctic Circle — Backend Context

## Project Overview
Arctic Circle is a web application for a sole proprietorship that sells and services home appliances (ACs, washing machines, refrigerators, stabilizers). The backend is a Spring Boot REST API connected to a PostgreSQL database. The frontend is built with TanStack Start (React + SSR).

## Business Rules
- No e-commerce checkout — customers place order requests, admin confirms via phone call
- Admin is a single fixed account seeded at startup — not managed through the app
- Admin is also the sole technician — no ticket assignment feature needed
- Payments are out of scope for MVP
- Every ticket status change must be logged in ticket_status_history with a timestamp
- Signup always creates a CUSTOMER — role cannot be chosen at signup
- Admin lives in a separate table (admin) — never in the users table

---

## Tech Stack
- **Framework**: Spring Boot 3.5.x
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT
- **Build tool**: Maven
- **Other**: Lombok

---

## Project Structure
```
src/main/java/com/arcticcircle/backend/
├── model/          # JPA entity classes (map to DB tables)
├── repository/     # JpaRepository interfaces (DB queries)
├── service/        # Business logic
├── controller/     # REST endpoints
├── dto/            # Request/Response objects
├── config/         # CORS, app configuration
└── security/       # JWT filter, auth config
```

---

## Database Schema

### admin
Stores the single admin account. Seeded on startup from environment variables. Never created through the app.

| Column | Type | Notes |
|---|---|---|
| admin_id | UUID | Primary key, auto-generated |
| name | VARCHAR | Admin name |
| email | VARCHAR | Unique, used for login |
| password | VARCHAR | BCrypt hashed |
| created_at | TIMESTAMP | Auto-set on insert |

### users
Stores all customer accounts only. Admin never appears here.

| Column | Type | Notes |
|---|---|---|
| user_id | UUID | Primary key, auto-generated |
| name | VARCHAR | Full name |
| email | VARCHAR | Unique, used for login |
| password | VARCHAR | BCrypt hashed |
| phone | VARCHAR | Used by admin for follow-up |
| address | VARCHAR | Pre-fills service ticket form |
| created_at | TIMESTAMP | Auto-set on insert |

### products
| Column | Type | Notes |
|---|---|---|
| product_id | UUID | Primary key |
| brand | VARCHAR | e.g. Daikin, Carrier |
| model_name | VARCHAR | Model identifier |
| tonnage | DECIMAL | e.g. 1.0, 1.5, 2.0 |
| star_rating | INT | 1 to 5 |
| type | ENUM | Split or Window |
| price | DECIMAL | Listed price |
| image_url | VARCHAR | URL to product image |
| created_at | TIMESTAMP | Auto-set on insert |

### orders
| Column | Type | Notes |
|---|---|---|
| order_id | UUID | Primary key |
| user_id | UUID | FK → users |
| product_id | UUID | FK → products |
| status | ENUM | Placed / Delivered |
| created_at | TIMESTAMP | Auto-set on insert |

### tickets
| Column | Type | Notes |
|---|---|---|
| ticket_id | UUID | Primary key |
| user_id | UUID | FK → users |
| appliance | ENUM | AC / WashingMachine / Fridge |
| complaint | TEXT | Problem description |
| address | VARCHAR | Service address |
| preferred_timings | VARCHAR | Customer preferred visit window |
| status | ENUM | Open / Completed |
| created_at | TIMESTAMP | Auto-set on insert |

### ticket_status_history
| Column | Type | Notes |
|---|---|---|
| tsh_id | UUID | Primary key |
| ticket_id | UUID | FK → tickets |
| status | ENUM | Open / Completed |
| changed_at | TIMESTAMP | Auto-set on insert |

---

## User Roles

### Customer
- Registers and logs in with email + password
- Stored in the users table
- Can browse products and place order requests
- Can raise service tickets and track their status
- JWT role = "CUSTOMER"

### Admin
- Single fixed account seeded on startup from environment variables
- Stored in the admin table — NOT in users
- Cannot be created through the app
- Can view and manage all orders (mark as Delivered)
- Can view and manage all tickets (mark as Completed)
- Every ticket status change is logged in ticket_status_history
- JWT role = "ADMIN"

---

## Authentication Flow

### Login — POST /api/auth/login
```
1. Check admin table first
   email + BCrypt password match → return JWT with role = ADMIN

2. If not admin, check users table
   email + BCrypt password match → return JWT with role = CUSTOMER

3. If neither → return 401 Unauthorized
```

### Signup — POST /api/auth/register
```
- Always creates a row in users table
- Role is always CUSTOMER — never from the request body
- Admin table is never touched
```

### JWT Structure
```json
{
  "sub": "user_id or admin_id",
  "email": "user@email.com",
  "role": "ADMIN or CUSTOMER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Request Authorization
- JWT sent in header: Authorization: Bearer <token>
- All endpoints except /api/auth/** and GET /api/products/** require valid JWT
- Admin endpoints additionally check role = ADMIN
- Customer endpoints additionally check role = CUSTOMER

---

## REST API Endpoints

### Auth (public)
```
POST /api/auth/register         → register new customer
POST /api/auth/login            → login for both admin and customer, returns JWT
```

### Products (public for GET)
```
GET  /api/products              → list all products
GET  /api/products/{id}         → single product detail
POST /api/products              → add product (ADMIN only)
```

### Orders
```
POST /api/orders                → customer places order (CUSTOMER)
GET  /api/orders                → admin gets all orders (ADMIN)
GET  /api/orders/my             → customer gets their own orders (CUSTOMER)
PUT  /api/orders/{id}/deliver   → admin marks order as delivered (ADMIN)
```

### Tickets
```
POST /api/tickets               → customer raises ticket (CUSTOMER)
GET  /api/tickets               → admin gets all tickets (ADMIN)
GET  /api/tickets/my            → customer gets their own tickets (CUSTOMER)
PUT  /api/tickets/{id}/complete → admin marks ticket as completed (ADMIN)
```

---

## Entity Classes (in model/)
- Admin.java — maps to admin table
- User.java — maps to users table (customers only)
- Product.java — maps to products table
- Order.java — maps to orders table, enum: Placed / Delivered
- Ticket.java — maps to tickets table, enum: Open / Completed
- TicketStatusHistory.java — maps to ticket_status_history table

---

## Admin Seeding
On startup, check if admin table is empty. If yes, create the admin account:

```java
@Component
public class AdminSeeder implements ApplicationRunner {
    public void run(ApplicationArguments args) {
        if (adminRepository.count() == 0) {
            Admin admin = Admin.builder()
                .name("Admin")
                .email(System.getenv("ADMIN_EMAIL"))
                .password(passwordEncoder.encode(System.getenv("ADMIN_PASSWORD")))
                .build();
            adminRepository.save(admin);
        }
    }
}
```

---

## Environment Variables (.env)
```
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
ADMIN_EMAIL=admin@arcticcircle.com
ADMIN_PASSWORD=admin123
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRY=86400000
```

---

## application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/arctic_circle
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
spring.application.name=arctic-circle-backend
```

---

## CORS
Frontend runs on http://localhost:8080 (TanStack Start dev server).
Backend should allow requests from this origin.
Update to production URL when deploying.

---

## What Has Been Done
- [x] Spring Boot project generated (Maven, Java 21, Spring Boot 3.5.x)
- [x] Dependencies added: Spring Web, Spring Data JPA, Spring Security, PostgreSQL Driver, Lombok
- [x] PostgreSQL database arctic_circle created
- [x] application.properties configured with environment variables
- [x] .env file created with DB and admin credentials
- [x] Folder structure created: model, repository, service, controller, dto, config, security
- [x] Entity classes created: User, Product, Order, Ticket, TicketStatusHistory

## What Needs to Be Done Next
- [ ] Create Admin.java entity in model/
- [ ] Create repository interfaces in repository/
- [ ] Create JWT utility class in security/
- [ ] Create Spring Security config in security/
- [ ] Create DTOs in dto/ for request/response bodies
- [ ] Create AuthService in service/ (login checks admin table first, then users)
- [ ] Create AdminSeeder to seed admin on startup
- [ ] Create service classes for orders, tickets, products
- [ ] Create controllers in controller/
- [ ] Configure CORS in config/
- [ ] Test all endpoints with Thunder Client
- [ ] Connect frontend to backend (replace mock data with API calls)

---

## Frontend Integration Notes
When backend is ready, these frontend files need to be updated:
- src/lib/auth-context.tsx → replace localStorage login with POST /api/auth/login, store JWT in sessionStorage
- src/lib/mock-data.ts → replace with API calls using fetch/useQuery
- All pages that use mock data → wire up to real endpoints
- Admin credentials hardcoded in frontend can be removed once JWT handles role routing