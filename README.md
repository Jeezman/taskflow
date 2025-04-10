## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

This project uses PostgreSQL with Drizzle ORM. To set up the database:

1. Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL=your_postgresql_connection_string
   ```

2. The database connection string should follow this format:

   ```
   postgresql://username:password@host:port/database
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. The database connection is automatically configured when you start the development server.

## Database Seeding

To seed the database with initial test data, run:

```bash
npm run db:seed
# or
yarn db:seed
# or
pnpm db:seed
```

This will create:

- A test user (email: johndoe@example.com, password: password123)
- A sample project
- Several test tasks with different statuses

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
