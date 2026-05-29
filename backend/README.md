# RPG Backend API

This is a NestJS backend API for managing RPG elements such as characters, spells, and users. It provides endpoints for CRUD operations, authentication, authorization, and game-related logic.

## Table of Contents

- [Technologies](#technologies)
- [Modules](#modules)
  - [Characters](#characters)
  - [Spells](#spells)
  - [Users](#users)
- [Authentication & Authorization](#authentication--authorization)
- [Middleware & Interceptors](#middleware--interceptors)
- [Constants & Enums](#constants--enums)
- [Testing](#testing)

## Technologies

- Node.js
- TypeScript
- NestJS Framework
- Class-validator & DTOs for input validation
- TypeORM or similar ORM (inferred from entity files)

## Modules

### Characters

Handles RPG characters with features like:

- Create, read, update, delete characters
- Manage character attributes:
  - Arcana
  - Level
  - Pact
  - Global properties
- Duplicate existing characters
- DTOs enforce validation and structure for incoming requests

**Endpoints (inferred from `characters.controller.ts`):**

- `POST /characters` – Create a new character
- `GET /characters/:id` – Get a character by ID
- `PUT /characters/:id` – Update character
- `DELETE /characters/:id` – Delete character
- `POST /characters/duplicate` – Duplicate character

### Spells

Manages RPG spells with features like:

- Create, update, delete spells
- Handle spell templates and upcasting mechanics
- Replace all spells in bulk
- Support for cantrips and damage dice scaling

**Endpoints (inferred from `spells.controller.ts`):**

- `POST /spells` – Create a new spell
- `GET /spells/:id` – Retrieve a spell by ID
- `PUT /spells/:id` – Update spell
- `DELETE /spells/:id` – Delete spell
- `POST /spells/replace-all` – Bulk replace all spells

### Users

Handles authentication, user management, and authorization:

- Sign up, sign in, update user
- Change password
- Retrieve user details
- Admin and client role guards

**Endpoints (inferred from controllers):**

- `POST /auth/signup` – Create a user
- `POST /auth/signin` – Sign in user
- `PUT /users/:id` – Update user
- `PUT /users/:id/password` – Change password
- `GET /users/:id` – Get user details

## Authentication & Authorization

- JWT-based authentication (assumed from `auth.guard.ts`)
- Role-based guards:
  - Admin
  - Client
- Current user injected via `current-user.middleware.ts` and decorator

## Middleware & Interceptors

- `CurrentUserMiddleware` – attaches the current user to requests
- `SerializeInterceptor` – ensures consistent response formatting

## Constants & Enums

- Game constants defined in `constants/game.constants.ts`
- Spell levels and attack types enums in `spells/enums/`

## Testing

- Unit tests for controllers and services exist (`*.spec.ts`)
- Tests cover characters, spells, and user authentication logic

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
