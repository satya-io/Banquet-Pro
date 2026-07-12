# 🏛️ Banquet Pro

A premium banquet and catering management platform for luxury event venues, powered by React, Express.js, and Azure Cosmos DB.

## Features

- 🎯 **Multi-Tenant Architecture** — Support multiple banquet venues with isolated data
- 📋 **Enquiry Pipeline** — Track leads from raw enquiry to confirmed booking
- 📅 **Booking Contracts** — Full lifecycle management with financial ledger
- 🗓️ **Event Calendar** — Interactive real-time schedule with overlap detection
- 🍽️ **Catering Menu** — Comprehensive menu management with categories
- 👥 **Role-Based Access** — Admin and Sales Agent roles with different permissions
- 🌐 **Bilingual Support** — English and Hindi translations
- 🔐 **JWT Authentication** — Secure API access with token-based auth
- 💾 **Azure Cosmos DB** — Cloud-native NoSQL database for persistent storage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4 |
| Backend | Express.js, Node.js |
| Database | Azure Cosmos DB (NoSQL API) |
| Auth | JWT (jsonwebtoken) |
| UI | Lucide React Icons, Framer Motion |

## Getting Started

### Prerequisites
- Node.js 18+
- Azure Cosmos DB account (or [Cosmos DB Emulator](https://learn.microsoft.com/en-us/azure/cosmos-db/emulator))

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your Cosmos DB credentials and JWT secret
```

### Configuration

Update `.env` with your credentials:
```env
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-primary-key
COSMOS_DATABASE=banquet-pro-db
JWT_SECRET=your-strong-secret-key
```

### Database Setup

```bash
# Seed the database with sample data
npm run server:seed
```

### Running

```bash
# Start both frontend and backend concurrently
npm run dev:full

# Or start separately:
npm run server:dev   # Backend on port 5000
npm run dev          # Frontend on port 3000
```

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Sales Agent | `sales` | `sales123` |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/enquiries` | List enquiries |
| POST | `/api/enquiries` | Create enquiry |
| PUT | `/api/enquiries/:id` | Update enquiry |
| DELETE | `/api/enquiries/:id` | Delete enquiry |
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id` | Update booking |
| DELETE | `/api/bookings/:id` | Delete booking |
| GET | `/api/menu` | List menu items |
| POST | `/api/menu` | Add menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |
| GET | `/api/venues` | List venues |
| POST | `/api/venues` | Add venue |
| DELETE | `/api/venues/:id` | Delete venue |
| GET | `/api/settings` | Get settings |
| PUT | `/api/settings` | Update settings |
| GET | `/api/settings/team` | List team members |
| GET | `/api/health` | Health check |

## Project Structure

```
Banquet-Pro/
├── server/                   # Express.js backend
│   ├── config/
│   │   └── cosmos.ts        # Cosmos DB connection & containers
│   ├── middleware/
│   │   └── auth.ts          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts          # Login/logout routes
│   │   ├── enquiries.ts     # Enquiry CRUD
│   │   ├── bookings.ts      # Booking CRUD
│   │   ├── menu.ts          # Catering menu CRUD
│   │   ├── venues.ts        # Venue spaces CRUD
│   │   ├── settings.ts      # Settings & team members
│   │   └── tenants.ts       # Tenant management
│   ├── index.ts             # Server entry point
│   ├── seed.ts              # Database seed script
│   └── tsconfig.json        # Server TypeScript config
├── src/                      # React frontend
│   ├── api/                 # API service layer
│   │   ├── client.ts        # HTTP client with JWT
│   │   ├── auth.ts          # Auth API calls
│   │   ├── enquiries.ts     # Enquiry API calls
│   │   ├── bookings.ts      # Booking API calls
│   │   ├── menu.ts          # Menu API calls
│   │   ├── venues.ts        # Venue API calls
│   │   └── settings.ts      # Settings API calls
│   ├── components/          # React UI components
│   ├── App.tsx              # Main application
│   ├── types.ts             # TypeScript interfaces
│   ├── data.ts              # Fallback seed data
│   ├── translations.ts      # i18n translations
│   └── main.tsx             # React entry point
├── .env.example             # Environment config template
├── package.json             # Dependencies & scripts
├── vite.config.ts           # Vite + API proxy config
└── tsconfig.json            # Frontend TypeScript config
```

## License

Private — All rights reserved.