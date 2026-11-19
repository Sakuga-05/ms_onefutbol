# Guía de endpoints para Postman — OneFutbol

Esta guía describe las rutas implementadas actualmente en `src/` y ofrece cuerpos de ejemplo para probarlas desde Postman.

## Preparar el proyecto y Postman

1. Configura las variables de conexión a MySQL en `.env` y asegúrate de que la base de datos y sus tablas estén creadas.
2. Inicia el servidor desde la raíz del proyecto:

   ```bash
   npm install
   npm run start:dev
   ```

3. La configuración actual usa el puerto `4000` en `.env`. Crea un Environment de Postman con:

   | Variable | Valor inicial |
   | --- | --- |
   | `baseUrl` | `http://localhost:4000` |
   | `deporteId` | `1` |
   | `equipoId` | `1` |
   | `relacionId` | `1` |

   Si cambias `PORT`, ajusta `baseUrl`. No hay prefijo global `api` ni autenticación configurada en estos controladores.

Para cada petición JSON selecciona **Body → raw → JSON**. Postman añadirá `Content-Type: application/json`. Las fechas deben enviarse como `YYYY-MM-DD`. Los IDs de ruta son enteros positivos.

## Orden recomendado

Para probar la relación entre equipos y deportes, crea primero un deporte y un equipo, y después crea la relación equipo-deporte usando los IDs devueltos. Los ejemplos de abajo siguen ese flujo.

## Deportes

### Crear deporte

`POST {{baseUrl}}/deportes`

```json
{
  "nombre": "Fútbol",
  "descripcion": "Fútbol asociación",
  "esColectivo": true,
  "minJugadores": 11,
  "maxJugadores": 11,
  "activo": true
}
```

`activo` y `descripcion` son opcionales. Para crear un subdeporte, envía `deportePadreId` con el ID de un deporte principal existente, por ejemplo `"deportePadreId": 1`. La jerarquía permite solo dos niveles.

### Listar deportes

`GET {{baseUrl}}/deportes`

### Consultar deporte

`GET {{baseUrl}}/deportes/{{deporteId}}`

### Consultar equipos inscritos en un deporte

`GET {{baseUrl}}/deportes/{{deporteId}}/equipos`

La respuesta tiene `deporteId` y una lista `equipos`.

### Actualizar deporte

`PATCH {{baseUrl}}/deportes/{{deporteId}}`

Envía únicamente los campos que quieras cambiar:

```json
{
  "descripcion": "Fútbol sala",
  "maxJugadores": 5
}
```

Para quitar el deporte padre de un subdeporte, usa `"deportePadreId": null`.

### Eliminar deporte

`DELETE {{baseUrl}}/deportes/{{deporteId}}`

No se puede borrar un deporte que tenga subdeportes o equipos asociados. Elimina primero esas relaciones; el API responde `409 Conflict` si sigue asociado.

## Equipos

### Crear equipo sin escudo

`POST {{baseUrl}}/equipos`

```json
{
  "nombre": "Club Deportivo Bogotá",
  "siglas": "CDB",
  "fechaFundacion": "2001-05-20",
  "ciudad": "Bogotá",
  "pais": "Colombia",
  "activo": true
}
```

`activo` es opcional. `siglas` admite hasta 12 caracteres.

### Crear o actualizar equipo con escudo

Las rutas `POST /equipos` y `PATCH /equipos/:id` aceptan un archivo opcional en el campo `escudo`.

1. En Postman elige **Body → form-data**.
2. Añade los campos de texto (`nombre`, `siglas`, `fechaFundacion`, `ciudad`, `pais`, `activo`).
3. Añade `escudo`, cambia su tipo de **Text** a **File** y selecciona la imagen.
4. No escribas manualmente el encabezado `Content-Type`: Postman debe establecer `multipart/form-data` con su boundary.

Se admiten JPG/JPEG, PNG, WEBP y GIF de hasta 5 MB. Para el campo `activo` en form-data usa `true` o `false` como texto. También es posible enviar JSON sin archivo, como en el ejemplo anterior.

### Listar equipos

`GET {{baseUrl}}/equipos`

### Consultar equipo

`GET {{baseUrl}}/equipos/{{equipoId}}`

### Consultar deportes de un equipo

`GET {{baseUrl}}/equipos/{{equipoId}}/deportes`

La respuesta tiene `equipoId` y una lista `deportes`.

### Actualizar equipo

`PATCH {{baseUrl}}/equipos/{{equipoId}}`

Con JSON puedes modificar datos de texto sin reemplazar el escudo:

```json
{
  "ciudad": "Medellín",
  "activo": false
}
```

Para subir/reemplazar el escudo, usa form-data como se describe arriba. Si omites el archivo, el escudo guardado no cambia. No hay una ruta implementada para borrar solo el escudo.

### Eliminar equipo

`DELETE {{baseUrl}}/equipos/{{equipoId}}`

No se puede borrar un equipo con deportes asociados; elimina primero sus relaciones. En caso contrario, se devuelve `409 Conflict`.

## Relación equipo-deporte

Esta entidad representa la inscripción de un equipo en un deporte y guarda datos propios de esa relación.

### Inscribir equipo en deporte

`POST {{baseUrl}}/equipos-deportes`

```json
{
  "fechaInscripcion": "2026-11-18",
  "entrenador": "Laura Gómez",
  "categoria": "Mayores",
  "equipoId": 1,
  "deporteId": 1
}
```

`entrenador` y `categoria` son opcionales. `equipoId` y `deporteId` deben corresponder a registros existentes. Usa Body raw JSON: los IDs deben ser números, no cadenas entre comillas.

### Listar relaciones

`GET {{baseUrl}}/equipos-deportes`

### Consultar relación

`GET {{baseUrl}}/equipos-deportes/{{relacionId}}`

### Actualizar relación

`PATCH {{baseUrl}}/equipos-deportes/{{relacionId}}`

```json
{
  "categoria": "Sub-20",
  "entrenador": "Carlos Ruiz"
}
```

También puedes cambiar `equipoId` o `deporteId` por IDs existentes, o `fechaInscripcion` con formato `YYYY-MM-DD`.

### Eliminar relación

`DELETE {{baseUrl}}/equipos-deportes/{{relacionId}}`

## Respuestas y validaciones

- Los `POST`, `GET` y `PATCH` devuelven el recurso creado, consultado o actualizado en JSON. Los `GET` de colección devuelven arreglos.
- Los `DELETE` exitosos devuelven un objeto con `message`.
- Un ID de ruta no numérico produce `400 Bad Request`; un recurso inexistente produce `404 Not Found`.
- Los DTOs validan campos obligatorios, tipos y límites. Campos no definidos en el DTO también producen `400 Bad Request` (whitelist estricta).
- Reglas de negocio, como rangos de jugadores inválidos, asociaciones que impiden borrar y jerarquías no permitidas, producen `409 Conflict`.
- Las respuestas de error de NestJS suelen incluir `statusCode`, `message` y `error`; revisa `message` para conocer el campo o regla que falló.

## Escudo servido como recurso estático

Al subir un escudo, la respuesta incluye `escudo` con una ruta como `uploads/escudos/<archivo>`. La aplicación publica la carpeta `uploads` bajo `/uploads/`, por lo que puedes abrirlo con:

`{{baseUrl}}/uploads/escudos/<archivo>`

