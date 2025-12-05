# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `apps/api` directory with the following variables:

### Environment
```bash
NODE_ENV=development
```

### Database Configuration
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=ahmadcodes_db
```

### JWT Configuration
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d
```

### Seeding Configuration

The `DEFAULT_USERS` variable defines which users should be created when running the seed command.

**Format:** `email:password:firstName:lastName:role,email:password:firstName:lastName:role`

**Available Roles:** `admin`, `editor`, `user`

**Example:**
```bash
DEFAULT_USERS=admin@test.com:password123:Admin:User:admin,editor@test.com:password123:Editor:User:editor,user@test.com:password123:Regular:User:user
```

This will create three users:
- **Admin User** (admin@test.com) with admin role
- **Editor User** (editor@test.com) with editor role  
- **Regular User** (user@test.com) with user role

**Note:** If `DEFAULT_USERS` is not set, the seeding process will skip user creation and show a warning.

## Complete .env Example

```bash
# Environment
NODE_ENV=development

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=ahmadcodes_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Seeding Configuration
DEFAULT_USERS=admin@test.com:password123:Admin:User:admin,editor@test.com:password123:Editor:User:editor,user@test.com:password123:Regular:User:user
```

## Security Notes

⚠️ **Important:** 
- Never commit the `.env` file to version control
- Use strong, unique secrets for production environments
- Change default passwords before deploying to production
- The `.env` file is already in `.gitignore`

