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

## Ejemplos

Listar todos los anuncios

`GET /anuncios`

Listar todos los anuncios que empiecen por 'ip':

`GET /anuncios?nombre=ip`

Listar todos los anuncios que tengan las etiquetas 'lifestyle' y 'work':

`GET /anuncios?tags=lifestyle,work`

Listar 3 anuncios saltándose el primero:

`GET /anuncios?skip=1&limit=3`

Listar todos los anuncios de venta cuyo precio esté comprendido entre 100 y 200 euros:

`GET /anuncios?venta=true&precio=100-200`

## Filtros

- `nombre`: String. Filtra los anuncios que empiecen por la cadena dada, ignorando mayúsculas y minúsculas.
- `tags`: String. Separadas por coma, filtra los anuncios que contengan las etiquetas dadas
- `venta`: Boolean. Cuando es true filtra los anuncios de oferta. Cuando es false, filtra los anuncios de demanda.
- `precio`: Float. Filtra por precio exacto, minimo, y/o máximo. Ejemplos:
  - `100`: Precio exacto de 100
  - `100-`: Precio mínimo de 100
  - `100-200`: Precio entre 100 y 200
  - `-299.99`: Precio máximo de 299.99
- `skip`: Integer. Se salta un número de anuncios para devolver
- `limit`: Integer. Limita el número de resultados

