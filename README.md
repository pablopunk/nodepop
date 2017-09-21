# Nodepop

# Instalar

## Base de datos

Configura los parámetros de la base de datos en un archivo `auth.json`:

```json
{
  "db_host": "my-database-url",
  "db_user": "my-database-user",
  "db_pass": "my-database-password",
  "db_name": "my-database-name"
}
```

Iníciala con algunos datos de prueba:

```bash
npm run clean_db # ATENCIÓN: Esto borra toda la base de datos
```

## Web

```bash
npm install
npm start
```

Para reiniciar el servidor automáticamente cuando estamos desarrollando:

```bash
npm run dev
```

# API

To do: document API
