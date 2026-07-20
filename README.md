# RentNest 🏠
> "Find & List Rental Properties with Ease"

**RentNest** is a robust, modular backend REST API for a rental property marketplace built using Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM. It enables Landlords to list and manage properties, Tenants to search, rent, and securely pay via Stripe, and Admins to moderate the platform.

---

## 🛠️ Tech Stack
- **Runtime Environment:** Node.js (v22+)
- **Framework:** Express.js (v5)
- **Programming Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) & Bcryptjs (password hashing)
- **Payment Gateway:** Stripe (using secure webhooks for payment processing)
- **Input Validation:** Zod
- **Deployment Platform:** Vercel

---

## 🚀 Core Features

### 🌍 Public Features
- Browse all available rental properties.
- Advanced search and filter properties by location, price range, categories, and amenities.
- View detailed property listings, including category details, landlord information, and tenant reviews.
- Browse property categories.

### 👤 Tenant Features
- Register and login securely.
- Submit rental requests for available properties.
- Make secure card payments via Stripe for approved rentals.
- View transactional payment history.
- View rental request history with statuses (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`, `CANCELLED`).
- Leave reviews for a property after a completed/active rental session.
- Manage and update personal profile.

### 🏘️ Landlord Features
- Create, edit, and delete property listings.
- Set property availability status (`AVAILABLE`, `RENTED`, `INACTIVE`).
- Approve or reject rental requests.
- View incoming rental requests for owned listings.

### 🛡️ Admin Features
- View all platform users (tenants and landlords).
- Manage user account statuses (Ban/Unban).
- View all properties and rental requests across the platform.
- Manage property categories (Create, Update, Delete with database relation protection).
- Get an aggregate Platform Overview (dashboard statistics: total users, total properties, total rentals, and total earnings).

---

## 📂 Project Structure
```text
rentnest-backend/
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma        # main generator + datasource config
│   │   ├── enums.prisma         # Role, RentalStatus, PaymentStatus, PaymentProvider enums
│   │   ├── user.prisma
│   │   ├── property.prisma
│   │   ├── category.prisma
│   │   ├── rental.prisma
│   │   ├── payment.prisma
│   │   └── review.prisma
│   └── seed.ts                  # Database seeder (Admin, Users, Categories, Properties)
│
├── src/
│   ├── config/
│   │   └── index.ts             # Env variables loader
│   │
│   ├── lib/
│   │   ├── prisma.ts            # PrismaClient Singleton Instance
│   │   └── stripe.ts            # Stripe Client Singleton Instance
│   │
│   ├── mddlewires/
│   │   ├── auth.middleware.ts       # Role-based JWT validation middleware
│   │   ├── validateRequest.ts       # Zod validation middleware
│   │   └── globalErrorHandler.ts    # Centralized global error & 404 handler
│   │
│   ├── modules/
│   │   ├── auth/                    # Authentication module
│   │   ├── user/                    # User profile & Admin management module
│   │   ├── category/                # Property categories module
│   │   ├── property/                # Rental property listings module
│   │   ├── rental/                  # Rental requests lifecycle module
│   │   ├── payment/                 # Stripe payment gateway & webhook module
│   │   └── review/                  # Tenant review module
│   │
│   ├── utilities/
│   │   ├── AppError.ts              # Custom AppError class
│   │   ├── sendResponse.ts          # Unified API response formatter
│   │   ├── catchAsync.ts            # Async wrapper utility
│   │   └── jwtHelpers.ts            # JWT generate & verify helpers
│   │
│   ├── routes/
│   │   └── index.ts                 # Master router
│   │
│   ├── app.ts                       # Express application configuration
│   └── server.ts                    # Server initialization
│
├── .env
├── .env.example
├── prisma.config.ts                 # Modern Prisma config file (v5.15.0+)
├── vercel.json                      # Vercel serverless deployment config
└── tsconfig.json
