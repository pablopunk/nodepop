# Nodepop [![Build Status](https://travis-ci.org/pablopunk/nodepop.svg?branch=master)](https://travis-ci.org/pablopunk/nodepop) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## API

### Ejemplos

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

Listar todos los anuncios de venta, todas las etiquetas, y el numero total de anuncios que cumplan los filtros (sin contar limit y skip):

`GET /anuncios?venta=true&all=true`


### Filtros

- `nombre`: String. Filtra los anuncios que empiecen por la cadena dada, ignorando mayúsculas y minúsculas
- `tags`: String. Separadas por coma, filtra los anuncios que contengan las etiquetas dadas
- `venta`: Boolean. Cuando es true filtra los anuncios de oferta. Cuando es false, filtra los anuncios de demanda
- `precio`: Float. Filtra por precio exacto, minimo, y/o máximo. Ejemplos:
  - `100`: Precio exacto de 100
  - `100-`: Precio mínimo de 100
  - `100-200`: Precio entre 100 y 200
  - `-299.99`: Precio máximo de 299.99
- `skip`: Integer. Se salta un número de anuncios para devolver
- `limit`: Integer. Limita el número de resultados
- `all`: Boolean: Cuando es true muestra todos los anuncios (filtrados), todas las etiquetas y el número total de anuncios filtrados (sin contar limit y skip)

## Contribuír

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Para desarrollar `nodepop` tendremos que tener en cuenta lo siguiente:


### Base de datos

Necesitaremos una base de datos mongodb, puedes inicializar una vacía y configurar los parámetros de la base de datos en un archivo `auth.json`:

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
npm run clean_db # ATENCIÓN: Esto borra toda la base de datos de anuncios
```


### Web

```bash
npm install
npm start
```

Para reiniciar el servidor automáticamente cuando estamos desarrollando:

```bash
npm run dev
```

Correr los test:

```bash
npm test
```


### Documentación

Toda esta documentación puede ser encontrada en [http://pablopunk.com/nodepop](http://pablopunk.com/nodepop). Para editarla y previsualizarla, usa [docute](docute.js.org):

```bash
docute .
```

