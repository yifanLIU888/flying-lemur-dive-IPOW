# Welcome to your Dyad app

## Database Setup

This application uses PostgreSQL with Prisma ORM for data persistence.

### Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up database**:
   - Make sure PostgreSQL is installed and running
   - Update `.env.local` with your database connection string:
     ```env
     DATABASE_URL="postgresql://username:password@localhost:5432/ipow_db"
     ```
   - Run the initialization script:
     ```bash
     chmod +x scripts/init-db.sh
     ./scripts/init-db.sh
     ```
   
   Or manually:
   ```bash
   # Create and run migrations
   npx prisma migrate dev --name init
   
   # Seed the database
   npx prisma db seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes (without migration)
npm run db:push

# Create and run a new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npm run db:reset

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Database Schema

The database consists of:

- **users** - User accounts (supports anonymous users)
- **cloudinary_configs** - User Cloudinary credentials
- **processing_jobs** - Image processing tasks
- **generated_results** - Generated images and content
- **newsletter_subscriptions** - Newsletter signups
- **usage_stats** - Usage tracking (optional)

See `database/README.md` for detailed schema documentation.

### Environment Variables

Create `.env.local` based on `.env.local.example`:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/ipow_db"

# Optional (for Cloudinary demo mode)
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
```

### Notes

- The app currently uses client-side Cloudinary uploads with user-provided credentials
- For production, implement a backend proxy to keep credentials secure
- All user data is isolated by user ID
- Newsletter subscriptions are stored with IP and user agent for security