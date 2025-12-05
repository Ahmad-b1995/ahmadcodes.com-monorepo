# Database Seeding

This directory contains the centralized database seeding implementation for the API.

## Overview

The seeding system uses a service-based approach with a CLI runner, making it easy to seed, clear, or refresh the database with initial data.

## Architecture

- **`seed.service.ts`** - Contains all seeding logic organized by entity type
- **`seed.module.ts`** - NestJS module that registers the seed service
- **`seed-runner.ts`** - CLI script for running seed commands (located in `src/`)

## Usage

### Seed the database

Run this to add initial data (permissions, roles, users, articles):

```bash
npm run seed
```

### Clear seeded data

Remove all seeded data from the database:

```bash
npm run seed:clear
```

### Refresh (clear + seed)

Clear existing data and reseed:

```bash
npm run seed:refresh
```

## What Gets Seeded

1. **Permissions** - All CRUD permissions for users, roles, and articles
2. **Roles** - Three roles with their permissions:
   - `admin` - Full access
   - `editor` - Article management
   - `user` - Read-only access
3. **Users** - Test users for each role:
   - `admin@test.com` (password: `password123`)
   - `editor@test.com` (password: `password123`)
   - `user@test.com` (password: `password123`)
4. **Articles** - Sample blog articles

## Features

- **Idempotent** - Safe to run multiple times, won't create duplicates
- **Ordered** - Seeds in the correct order to handle dependencies
- **Logging** - Clear console output showing what's being created
- **Standalone** - Can be run independently of the main application

## Development

To add new seed data:

1. Add a new private method to `SeedService` (e.g., `seedCategories()`)
2. Call it in the `seedAll()` method
3. Add corresponding cleanup in `clearAll()` method

## Notes

- This replaces the old `OnModuleInit` seeder approach
- The old `ENABLE_SEEDING` environment variable is no longer needed
- Seeding is now done explicitly via CLI commands

