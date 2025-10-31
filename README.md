# TaskFlow

A modern task management application built with Next.js, TypeScript, and PostgreSQL.

## Technology Stack

### Frontend

- **Next.js 15** - React framework for server-rendered applications
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database ORM

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- npm, yarn, or pnpm package manager

## Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd taskflow
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your PostgreSQL connection string:
     ```
     DATABASE_URL=postgresql://username:password@host:port/database
     ```
   - Update the `SESSION_SECRET` with any text of your choice:
     ```
     SESSION_SECRET=your_secret_key
     ```

4. Set up the database:

   ```bash
   # Generate database migrations
   npm run db:generate

   # Apply migrations
   npm run db:push

   # Seed the database with test data
   npm run db:seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:push` - Push schema changes to the database
- `npm run db:seed` - Seed the database with test data

## Database Seeding

The database seeding script creates:

- A test user (email: johndoe@example.com, password: password123)
- A sample project
- Several test tasks with different statuses

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Taskflow PR
Adding a taskflow PR for test purpose
Adding number 2 test
Another change after review
Another fix
