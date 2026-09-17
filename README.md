# Shark2026 🦈

Sistema interno de inventario y ventas para los 4 módulos de la tienda:

- Centro
- Mall Plaza – Sol
- Mall Plaza – Punto
- Mall Vivo Coquimbo

Permite registrar ventas (con vendedor y medio de pago), llevar el stock de productos por módulo, y administrar el catálogo. Sitio en vivo (demo, aún sin conectar a Firebase): https://savkacarvajal.github.io/shark2026/

## Stack

- **[Astro](https://astro.build)** — genera un sitio liviano, con poco JavaScript.
- **[Firebase](https://firebase.google.com)** — Authentication (login) y Firestore (base de datos).
- **GitHub Pages** — hosting gratis, se actualiza solo con cada `git push` a `master`.

## Estructura del proyecto

```
src/
  pages/            → cada archivo es una pantalla (login, ventas, inventario, etc.)
  layouts/           → estructura visual compartida (menú, colores)
  lib/
    constants.ts      → módulos, categorías de productos y medios de pago
    guards.ts          → protege páginas que requieren login
    firebase/           → todo lo que habla con Firebase (auth, productos, stock, ventas)
scripts/
  setup-accounts.ts   → crea las 6 cuentas reales (2 administradoras + 4 módulos)
firestore.rules       → reglas de seguridad de la base de datos
```

## Cómo correrlo localmente

```sh
npm install
npm run dev
```

Abre `http://localhost:4321`.

⚠️ Mientras no esté conectado Firebase (ver sección siguiente), el login y las páginas que dependen de datos no van a funcionar todavía — es normal.

## Conectar Firebase (pendiente)

1. Crear el proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. Activar **Authentication** (método Correo/Contraseña) y **Firestore Database**
3. Registrar una app web y copiar la configuración a un archivo `.env` (usar `.env.example` como base)
4. Descargar la clave de cuenta de servicio y guardarla como `serviceAccountKey.json` en la raíz del proyecto (nunca se sube a GitHub)
5. Correr `npm run setup-accounts` para crear las 6 cuentas reales
6. Desplegar las reglas de seguridad: `npx firebase deploy --only firestore:rules,firestore:indexes`

## Comandos

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Corre el sitio en local para desarrollar |
| `npm run build` | Genera la versión final en `./dist/` |
| `npm run setup-accounts` | Crea/actualiza las 6 cuentas y sus permisos en Firebase |
| `npx astro check` | Revisa errores de tipos en el código |
