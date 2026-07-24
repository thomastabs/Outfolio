# Runtime Spec

**Locked at:** 2026-07-23 17:38 UTC

## Runtime Contract

### Frontend
- **RT-1**: Next.js in app directory mode with React Server Components disabled; source root at `/src/frontend/`; API routes proxied to backend FastAPI under `/api/v1/`; build command `next build`; client-side routing for public pages and authenticated SPA for user dashboard and project editing.

### Backend
- **RT-2**: FastAPI app with import path `app.main`; health endpoint at `/api/v1/health`; API versioning via URL path prefix `/api/v1/`; environment variables required: `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `OPENAI_API_KEY` (for AI features); CORS configured to allow frontend origin; OAuth2 Bearer token authentication for protected endpoints.

### Database
- **RT-3**: PostgreSQL with schema managed by Alembic migrations; migration command `alembic upgrade head`; required extensions: `uuid-ossp` for UUID generation; bootstrap strategy: initial schema created on first migration; session strategy: SQLAlchemy session per request; schema evolution: additive changes deployed via migrations; breaking changes handled by creating new columns and deprecating old ones with data migration scripts; rollback via Alembic downgrade commands.

## First Prototype Path

1. Visitor opens registration page and submits unique username, valid email, and password to register a new account — calls {EP-1}  
2. Visitor logs in with registered username and password — calls {EP-2}  
3. Logged-in user views their profile page — calls {EP-3}  
4. User edits profile fields including name, bio, OutSystems experience, certifications, and links, then saves — calls {EP-4}  
5. User creates a new project draft by providing title and role — calls {EP-9}  
6. User edits project details such as summary and tags — calls {EP-11}  
7. User adds a new project section (e.g., Problem) — calls {EP-18}  
8. User edits the content of the Problem section — calls {EP-20}  
9. User uploads a screenshot image to the project — calls {EP-34}  
10. User uploads a `.oml` artifact file — calls {EP-33}  
11. User triggers AI draft case study generation for the project — calls {EP-54}  
12. User retrieves and reviews the AI-generated draft — calls {EP-55}  
13. User saves edits to the AI draft — calls {EP-56}  
14. User sets project visibility to public — calls {EP-62}  
15. User publishes the project — calls {EP-13}  
16. Visitor opens the public project URL to view the published project page — calls {EP-67}  
17. Visitor views the developer's public portfolio page — calls {EP-68}

## Assumptions

- {RT-1}: Next.js chosen for frontend as per locked tech stack; app directory mode assumed for modern Next.js; API strategy uses proxy to FastAPI backend under `/api/v1/` for REST endpoints.  
- {RT-2}: FastAPI app import path `app.main` is conventional; health endpoint `/api/v1/health` assumed standard; API versioning via URL path prefix `/api/v1/` as per endpoint list; environment variables inferred from stack and AI integration needs.  
- {RT-3}: Alembic is standard migration tool for PostgreSQL with SQLAlchemy; `uuid-ossp` extension assumed for UUIDs; additive schema changes deployed via migrations; breaking changes handled carefully with data migration and backward compatibility; session per request is standard pattern.