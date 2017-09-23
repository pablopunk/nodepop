# Nodepop

# Install

## Database

Configure your **mongodb** settings in a file called `auth.json`:

```json
{
  "db_host": "my-database-url",
  "db_user": "my-user",
  "db_pass": "my-password",
  "db_name": "my-database-name"
}
```

Populate database with:

```bash
npm run clean_db # WARNING: Removes all data in your database!
```

## Web

```bash
npm install
npm start
```

For restarting the server automatically while coding use:

```bash
npm run dev
```

# API


