# CSC289 Mobile App

A full-stack retail/e-commerce mobile application built with Expo (React Native) and NestJS. Features product browsing, shopping cart, orders, and customer management with JWT authentication.

## Tech Stack

- **Mobile**: Expo (React Native), NativeWind (Tailwind CSS), Expo Router, React Hook Form, Zod
- **Backend**: NestJS, Prisma, SQL Server, CQRS, JWT, Swagger
- **Package Manager**: pnpm (workspaces)

## Prerequisites

- Node.js 18+
- pnpm
- SQL Server (or access to a remote instance)
- iOS Simulator / Android Emulator / Expo Go (for mobile testing)

## Project Structure

```
├── app/                    # Expo app (file-based routing)
├── components/             # Shared UI components
├── features/               # Feature modules (cart, orders, products)
├── server/                 # NestJS API
│   ├── prisma/             # Database schema & migrations
│   └── src/                # API source
└── pnpm-workspace.yaml     # Monorepo config
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the server

Create `server/.env` with the following variables:

```env
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
JWT_SECRET=your-secret-key

# Database (SQL Server)
DATABASE_URL="sqlserver://HOST:PORT;database=DB_NAME;user=USER;password=PASSWORD;trustServerCertificate=true;"
```

### 3. Set up the database

```bash
cd server
pnpm run db:generate
pnpm run db:migrate
```

### 4. Run the application

**Option A – Run both app and server together:**

```bash
pnpm run dev:concurrent
```

**Option B – Run separately:**

```bash
# Terminal 1: Start the API
pnpm -C server run dev

# Terminal 2: Start the mobile app
pnpm run start
```

Then choose an option from the Expo CLI:

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Expo Go**: Scan the QR code with your device

## API Documentation

When the server is running, Swagger UI is available at:

- **Local**: http://localhost:3000/api/swagger

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run start` | Start the Expo app |
| `pnpm run dev:concurrent` | Run app + server together |
| `pnpm run android` | Start Expo with Android |
| `pnpm run ios` | Start Expo with iOS |
| `pnpm run dev` | Alias for `expo start` |
| `pnpm run lint` | lint the mobile app |
| `pnpm run typecheck` | TypeScript check |

**Server scripts** (run from `server/` or with `pnpm -C server run <script>`):

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start NestJS in watch mode |
| `pnpm run db:generate` | Generate Prisma client |
| `pnpm run db:migrate` | Run database migrations |
| `pnpm run db:push` | Push schema to DB (dev) |

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [NestJS documentation](https://docs.nestjs.com/)
- [Prisma documentation](https://www.prisma.io/docs)
