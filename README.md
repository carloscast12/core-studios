# Core Studios

## English

Fullstack (MERN) app for a DJ/production studio: book a cabin, run a small social feed with the community, and browse extra services — with an admin layer to manage bookings and moderate content.

Live demo: _coming soon (not deployed yet)_

### Features

- Register/login with JWT, rate-limited against brute force.
- Book a DJ or production cabin (date, time, duration), see your own reservations, edit or cancel pending ones.
- **Admin panel**: view every user's bookings filtered by day, confirm or cancel any of them. Bookings past their end time are purged automatically.
- Social feed: post text + one image (cropped client-side before upload), like, comment, delete your own posts/comments.
- **Admin moderation**: delete any post or comment, not just your own.
- Follow system: follow/unfollow, "who to follow" suggestions, followers/following lists (visible only to the profile owner).
- Public user profiles with stats (posts, followers, following, total likes); edit your own name, bio, social links and avatar (Cloudinary).
- **Admin**: delete a user, cascading their posts, comments, bookings and follows.
- Services page (equipment rental, podcast, DJ set recording) with an inquiry form that emails the studio (Brevo/Nodemailer).
- Shared landing page for Login/Register showcasing the app's features.
- Responsive UI, including a slide-in mobile nav and an overlapping-card mobile auth screen.

### Stack

Frontend: React, Vite, React Router, Axios, react-easy-crop
Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Cloudinary, Nodemailer (Brevo SMTP), express-rate-limit
Testing: Vitest, Supertest, mongodb-memory-server
Deploy (planned): Netlify (frontend), Render (backend), MongoDB Atlas (database)

> Render's free tier "sleeps" after a period of inactivity — once deployed there, the first request after a while can take 30-50 seconds while the server spins back up.

### Project structure

```
backend/    Express API (auth, bookings, posts, comments, follows, services, users)
frontend/   React SPA (Vite)
```

### API

All routes are prefixed with `/api`. Every route except `/auth/*` requires `Authorization: Bearer <token>`.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create user |
| POST | `/auth/login` | Login, returns JWT |
| POST | `/auth/logout` | Logout |
| GET/PUT | `/users/profile` | Get / update your own profile |
| POST | `/users/avatar` | Upload avatar |
| GET | `/users/stats` | Your own stats |
| GET | `/users/:id` | Public profile by id |
| GET | `/users/:id/stats` | Stats for a given user |
| GET | `/users/:id/followers` / `/following` | Followers / following list (owner only) |
| DELETE | `/users/:id` | Delete a user (admin only, cascades) |
| POST | `/bookings` | Create a booking |
| GET | `/bookings/my` | Your own bookings |
| GET | `/bookings/admin` | All users' bookings (admin only) |
| GET | `/bookings/slots` | Taken slots for a date + cabin type |
| PUT/DELETE | `/bookings/:id` | Update / cancel a booking |
| PUT | `/bookings/:id/status` | Confirm a booking (admin only) |
| POST | `/posts` | Create a post (with image) |
| GET | `/posts` | List posts (paginated) |
| GET/DELETE | `/posts/:id` | Get a post with comments / delete it |
| PUT | `/posts/:id/like` | Like / unlike a post |
| POST/DELETE | `/comments/:id` | Add a comment to a post / delete a comment |
| GET | `/follows/suggestions` | "Who to follow" suggestions |
| POST/DELETE | `/follows/:userId` | Follow / unfollow a user |
| POST | `/services/inquiry` | Send a service inquiry email |

### Run it locally

**Backend**

```
cd backend
npm install
```

Create a `.env` with:

```
PORT=2345
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<any secret string>
CLOUDINARY_CLOUD_NAME=<cloudinary cloud name>
CLOUDINARY_API_KEY=<cloudinary api key>
CLOUDINARY_API_SECRET=<cloudinary api secret>
BREVO_SMTP_USER=<brevo smtp login>
BREVO_SMTP_PASS=<brevo smtp key>
CONTACT_EMAIL=<studio contact email>
```

```
npm run dev
```

**Frontend**

```
cd frontend
npm install
npm run dev
```

By default it points to `http://localhost:2345/api`. To point at a different backend, set `VITE_API_URL` in a local `.env` (see `.env.example`).

---

## Español

Aplicación fullstack (MERN) para un estudio de DJ/producción: reservar una cabina, un feed social pequeño con la comunidad, y servicios adicionales — con una capa de administrador para gestionar reservas y moderar contenido.

Demo en vivo: _próximamente (aún no desplegada)_

### Features

- Registro y login con JWT, con límite de intentos contra fuerza bruta.
- Reservar cabina de DJ o de producción (fecha, hora, duración), ver tus propias reservas, editar o cancelar las pendientes.
- **Panel de administrador**: ver las reservas de todos los usuarios filtradas por día, confirmar o cancelar cualquiera. Las reservas vencidas se eliminan automáticamente.
- Feed social: publicar texto + una imagen (recortada en el cliente antes de subir), dar like, comentar, eliminar tus propios posts/comentarios.
- **Moderación de administrador**: eliminar cualquier post o comentario, no solo los propios.
- Sistema de follow: seguir/dejar de seguir, sugerencias de "a quién seguir", listas de seguidores/seguidos (visibles solo para el dueño del perfil).
- Perfiles públicos con estadísticas (posts, seguidores, seguidos, likes totales); edición de nombre, bio, redes sociales y avatar propio (Cloudinary).
- **Administrador**: eliminar un usuario, en cascada con sus posts, comentarios, reservas y follows.
- Página de servicios adicionales (alquiler de equipos, podcast, grabación de sets) con formulario de consulta que envía un correo al estudio (Brevo/Nodemailer).
- Landing page compartida entre Login/Register mostrando las funciones de la app.
- UI responsiva, incluyendo un menú móvil tipo sidebar deslizable y una pantalla de login/registro con card superpuesto en móvil.

### Stack

Frontend: React, Vite, React Router, Axios, react-easy-crop
Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Cloudinary, Nodemailer (Brevo SMTP), express-rate-limit
Testing: Vitest, Supertest, mongodb-memory-server
Deploy (planeado): Netlify (frontend), Render (backend), MongoDB Atlas (base de datos)

> El free tier de Render "duerme" tras un rato de inactividad — una vez desplegado ahí, la primera petición después de un rato puede tardar 30-50 segundos mientras el servidor arranca de nuevo.

### Estructura del proyecto

```
backend/    API Express (auth, reservas, posts, comentarios, follows, servicios, usuarios)
frontend/   SPA de React (Vite)
```

### API

Todas las rutas tienen el prefijo `/api`. Todas excepto `/auth/*` requieren `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Crear usuario |
| POST | `/auth/login` | Login, devuelve JWT |
| POST | `/auth/logout` | Logout |
| GET/PUT | `/users/profile` | Ver / actualizar tu propio perfil |
| POST | `/users/avatar` | Subir avatar |
| GET | `/users/stats` | Tus propias estadísticas |
| GET | `/users/:id` | Perfil público por id |
| GET | `/users/:id/stats` | Estadísticas de un usuario |
| GET | `/users/:id/followers` / `/following` | Lista de seguidores / seguidos (solo dueño) |
| DELETE | `/users/:id` | Eliminar usuario (solo admin, en cascada) |
| POST | `/bookings` | Crear reserva |
| GET | `/bookings/my` | Tus propias reservas |
| GET | `/bookings/admin` | Reservas de todos los usuarios (solo admin) |
| GET | `/bookings/slots` | Horarios ocupados por fecha y tipo de cabina |
| PUT/DELETE | `/bookings/:id` | Editar / cancelar una reserva |
| PUT | `/bookings/:id/status` | Confirmar una reserva (solo admin) |
| POST | `/posts` | Crear post (con imagen) |
| GET | `/posts` | Listar posts (paginado) |
| GET/DELETE | `/posts/:id` | Ver post con comentarios / eliminarlo |
| PUT | `/posts/:id/like` | Dar / quitar like a un post |
| POST/DELETE | `/comments/:id` | Comentar un post / eliminar un comentario |
| GET | `/follows/suggestions` | Sugerencias de "a quién seguir" |
| POST/DELETE | `/follows/:userId` | Seguir / dejar de seguir a un usuario |
| POST | `/services/inquiry` | Enviar consulta de servicio por correo |

### Correrlo en local

**Backend**

```
cd backend
npm install
```

Crea un `.env` con:

```
PORT=2345
MONGO_URI=<tu connection string de MongoDB>
JWT_SECRET=<cualquier string secreto>
CLOUDINARY_CLOUD_NAME=<cloud name de cloudinary>
CLOUDINARY_API_KEY=<api key de cloudinary>
CLOUDINARY_API_SECRET=<api secret de cloudinary>
BREVO_SMTP_USER=<usuario smtp de brevo>
BREVO_SMTP_PASS=<clave smtp de brevo>
CONTACT_EMAIL=<correo de contacto del estudio>
```

```
npm run dev
```

**Frontend**

```
cd frontend
npm install
npm run dev
```

Por defecto apunta a `http://localhost:2345/api`. Para apuntar a otro backend, define `VITE_API_URL` en un `.env` local (ver `.env.example`).
