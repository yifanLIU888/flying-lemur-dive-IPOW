#!/bin/bash

# IPOW Database Initialization Script
# This script sets up the PostgreSQL database for the IPOW application

set -e  # Exit on any error

echo "=========================================="
echo "IPOW Database Initialization"
echo "=========================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first:"
    echo "  - macOS: brew install postgresql"
    echo "  - Ubuntu: sudo apt-get install postgresql"
    echo "  - Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Check if DATABASE_URL is set in .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local and set your DATABASE_URL"
    exit 1
fi

# Extract database connection details from DATABASE_URL
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d'=' -f2-)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env.local"
    echo "Please set it to your PostgreSQL connection string"
    echo "Example: postgresql://username:password@localhost:5432/ipow_db"
    exit 1
fi

echo "✓ Database connection string found"

# Parse connection details (simple parsing for postgresql://user:pass@host:port/db)
# This is a simplified parser - for production use a proper URL parser
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

if [ -z "$DB_NAME" ]; then
    echo "❌ Could not parse database name from DATABASE_URL"
    exit 1
fi

echo "✓ Database name: $DB_NAME"

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
# Extract host, port, user, password for createdb
# This is a simplified approach - may need adjustment based on your DATABASE_URL format
HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\).*/\1/p')
PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p' | tail -1)
USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

# Try to create database
export PGPASSWORD=$PASS
if psql -h $HOST -p $PORT -U $USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✓ Database '$DB_NAME' already exists"
else
    echo "Creating database '$DB_NAME'..."
    createdb -h $HOST -p $PORT -U $USER $DB_NAME
    echo "✓ Database created successfully"
fi

# Run Prisma migrate
echo ""
echo "Running Prisma migrations..."
npx prisma migrate dev --name init

# Run seed script
echo ""
echo "Seeding database..."
npx prisma db seed

echo ""
echo "=========================================="
echo "✓ Database initialization complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open Prisma Studio to view data: npx prisma studio"
echo ""