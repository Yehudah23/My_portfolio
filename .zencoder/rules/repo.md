---
description: Repository Information Overview
alwaysApply: true
---

# Myportfolio Information

## Summary
A personal portfolio website built with Angular 20. The project includes various sections like home, contact, projects, and skills. It uses a PHP backend for the contact form functionality.

## Structure
- **src/**: Contains the Angular application source code
  - **app/**: Main application components (about, contact, home, projects, skills, etc.)
  - **assets/**: Static assets for the application
- **php/**: Contains PHP backend files for the contact form
- **public/**: Public assets like favicon
- **.angular/**: Angular cache and build files
- **.vscode/**: VS Code configuration

## Language & Runtime
**Language**: TypeScript, HTML, CSS, PHP
**Version**: Angular 20.0.1, TypeScript 5.8.2
**Build System**: Angular CLI
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Angular Core ^20.0.0
- Angular Router ^20.0.0
- Angular SSR ^20.0.1
- Bootstrap ^5.3.8
- Bootstrap Icons ^1.10.5
- Express ^5.1.0
- RxJS ~7.8.0

**Development Dependencies**:
- Angular CLI ^20.0.1
- Angular Compiler CLI ^20.0.0
- Jasmine ~5.1.0
- Karma ~6.4.0
- TypeScript ~5.8.2

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm start
# OR with API proxy
npm run start:proxy

# Build for production
npm run build

# Run PHP backend
npm run php
```

## Backend Integration
**PHP Backend**: Simple PHP backend for contact form processing
**Proxy Configuration**: Angular dev server configured to proxy API requests to PHP backend
**API Endpoint**: `/api` routes are proxied to `http://localhost:8000`

## Testing
**Framework**: Jasmine with Karma
**Test Location**: `src/**/*.spec.ts`
**Configuration**: `tsconfig.spec.json`, Karma configuration
**Run Command**:
```bash
npm test
```

## Server-Side Rendering
**SSR Configuration**: Configured for Angular Universal
**Entry Points**:
- Browser: `src/main.ts`
- Server: `src/main.server.ts`
- SSR Entry: `src/server.ts`
**Serve Command**:
```bash
npm run serve:ssr:Myportfolio
```