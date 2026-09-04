# Affinity — Graph-based Identity Social Platform

Affinity is a modern social identity platform leveraging graph database technologies to map and visualize connections between users, their interests, and communities.

## Architecture

- **Backend**: Node.js, Express, TypeScript
- **Database**: Neo4j (Graph Database)
- **Frontend**: React, TypeScript, Vite

## Tech Stack

- **Runtime**: Node.js 20+
- **Database**: Neo4j Community Edition 5
- **Package Manager**: npm (Workspaces)
- **Containerization**: Docker & Docker Compose
- **Tooling**: Concurrently

## Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm

## Quick Start

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the database**:
   ```bash
   npm run db:up
   ```

3. **Run migrations**:
   ```bash
   npm run migrate
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start the development servers**:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Neo4j Browser: `http://localhost:7474` (Credentials: neo4j / affinity_dev_2026)

## API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API health |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/:id` | Get user details |
| POST | `/api/users/:id/connect` | Connect two users |
| GET | `/api/graph` | Get graph representation |

For detailed API documentation, refer to the backend codebase.
