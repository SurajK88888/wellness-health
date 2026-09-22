## Verdant - Wellness & Health Portal
A modern, full-stack, enterprise-grade digital health and wellness web application. The platform enables patients to access holistic health guides, browse wellness products, manage profiles, and schedule online consultations. It includes an integrated Admin Dashboard for medical staff and content managers to control site-wide copy, products, blogs, and appointment configurations dynamically.
------------------------------
## Key Features

*  Role-Based Authentication: Secure email/password login flow with dedicated workflows for normal users and platform administrators.
*  Consultation Booking System: Interactive scheduling engine allowing users to select slots, review consultation cards, and dispatch instant appointment requests.
*  Comprehensive Admin Suite: Content management system (CMS) allowing live creation, updating, and tracking of health blogs, product catalogs, and notification templates.
*  Wellness Showcase: Product preview catalog featuring advanced categorized item lists, detailed specifications, and responsive filter badges.
*  Real-Time Notification Matrix: Persistent dropdown notification system handling live alerts for upcoming appointments or booking adjustments.
*  Adaptive Theming Framework: Clean responsive layout supporting automated dynamic switching between Light and Dark display profiles.

------------------------------
## Tech Stack & Architectural Layers## Frontend Core

* Framework: React 18+ (Functional Components with Hooks Architecture) [2]
* Language: TypeScript (Strictly typed schemas for database integrations and application states) [2]
* Build Automation Engine: Vite [2]
* Runtime Environment: Bun [2]

## Design & Interface Component Primitives

* Layout Engine: Tailwind CSS [2]
* UI System Base: Radix UI primitives wrapped via Shadcn UI components [2]
* Icons & Assets: Lucide React icons library [2]

## Backend as a Service (BaaS) Layer

* Cloud Host & Storage: Supabase Cloud [2]
* Database: PostgreSQL with full Relational integrity constraints [2]
* Serverless Operations: Supabase Edge Functions (TypeScript-driven server environments) [2]

## Testing Suite

* Unit & Integration Tests: Vitest environment with configuration parameters [2]
* E2E Testing Layout: Playwright Automation framework scaffolding [2]

------------------------------
## 📂 Project Directory Structure

wellness-health-main/
├── .gitignore                   # Version control exclusions
├── components.json              # Shadcn UI composition configuration
├── eslint.config.js             # Code formatting and rule specifications
├── index.html                   # Entry point markup wrapper
├── package.json                 # Dependency version indices
├── postcss.config.js            # CSS compilation rules
├── tailwind.config.ts           # Custom core theme rules and extensions
├── tsconfig.json                # Global compilation presets
├── vite.config.ts               # Production build configs
├── vitest.config.ts             # Test environment definitions
├── playwright.config.ts         # Automated browser test configuration
│
├── public/                      # Static entry configurations and icons
│   ├── placeholder.svg
│   ├── robots.txt
│   └── wellness-health-icon.png
│
├── supabase/                    # BaaS Configuration Infrastructure
│   ├── config.toml              # Project identification parameters
│   ├── functions/               # Cloud Edge serverless worker handlers
│   │   └── notify-booking/      # Appointment notification logic
│   └── migrations/              # Incremental SQL evolutionary schema scripts
│
└── src/                         # Core Application Source Code
    ├── main.tsx                 # Core rendering root initialization file
    ├── index.css                # Global layer styles and Tailwind extensions
    ├── vite-env.d.ts            # Client environment typescript definitions
    │
    ├── assets/                  # Product and thematic marketing image collections
    │
    ├── components/              # Layout Composition Ecosystem
    │   ├── CategoryFilter.tsx
    │   ├── Footer.tsx
    │   ├── Navbar.tsx
    │   ├── SearchBar.tsx
    │   ├── ProtectedRoute.tsx   # Access control routing middleware
    │   ├── admin/               # Administrative panel controls
    │   │   └── ContentManager.tsx
    │   ├── home/                # Public page section frames
    │   │   ├── HeroSection.tsx
    │   │   ├── FeaturedArticles.tsx
    │   │   └── ProductPreview.tsx
    │   └── ui/                  # Atomized Shadcn low-level component wrappers
    │       ├── accordion.tsx    ├── button.tsx    ├── dialog.tsx
    │       ├── carousel.tsx     ├── form.tsx      ├── select.tsx
    │
    ├── contexts/                # State Context distribution modules
    │   └── AuthContext.tsx      # Supabase Session Broadcast State
    │
    ├── hooks/                   # Business Logic custom hook components
    │   ├── use-blogs.ts         ├── use-notifications.ts
    │   ├── use-meetings.ts      ├── use-products.ts
    │   └── use-toast.ts
    │
    ├── integrations/            # Structural data mapping layers
    │   └── supabase/
    │       ├── client.ts        # Shared authentication instance link Client
    │       └── types.ts         # Direct structural mappings to remote tables
    │
    ├── lib/                     # Global utilities
    │   ├── utils.ts             # Tailwind class merges (clsx + tailwind-merge)
    │   └── supabase-helpers.ts
    │
    └── pages/                   # Application Screen View Templates
        ├── AdminDashboard.tsx   # Dashboard access interface
        ├── Auth.tsx             # Interactive authentication access screen
        ├── Blog.tsx             # Holistic informational article indexes
        ├── BookConsultation.tsx # Patient reservation booking workspace
        ├── HealthGuide.tsx      # Comprehensive library matrix view
        └── Profile.tsx          # Account update user layout

------------------------------
## Core Engineering & Development Concepts Used## 1. Incremental Database Evolutions (Database Migrations)
Database schemas are managed using sequential SQL migrations (supabase/migrations/). This approach enforces programmatic schema evolution, trackable version history, relational foreign keys, row-level security (RLS) policies, and seamless cross-environment database replication.
## 2. Custom Data Fetching Hooks (Reactive Cache & Sync Architecture)
Data operations are abstracted away from view layouts using custom hooks (use-blogs.ts, use-meetings.ts). These hooks manage loading and error states while mapping backend data structures directly to client views, keeping presentation components clean and maintainable.
## 3. Client-Side Security Layering (Protected Routes Architecture)
Route access is guarded by security layers (ProtectedRoute.tsx) that intercept path transitions. By reading session claims from the AuthContext, the application redirects unauthorized requests to authentication walls and restricts internal dashboard nodes exclusively to accounts with administrative privileges.
## 4. Headless Core UI Primitives Integration
The layout layer separates design style sheets from complex interactive behaviors. By building on headless UI elements, component states (such as active modals or select list overlays) remain secure and accessible, while Tailwind controls the stylistic theme presentation layer.
## 5. Automated Edge Automation Framework
Serverless logic is executed via cloud edge workers (supabase/functions/notify-booking/). This isolates specialized background tasks—such as executing custom database scripts or dispatching booking updates—away from client processing cycles, improving frontend page load performance.
------------------------------
## ⚙️ Local Development Setup
Follow these steps to run the project locally on your machine:
## Prerequisites
Ensure you have the Bun runtime installed globally:

curl -fsSL https://bun.sh | bash

## Installation Steps

   1. Clone the Repository:
   
   git clone <repository-url>
   cd wellness-health-main
   
   2. Install Dependencies:
   
   bun install
   
   3. Supabase Local Initialisation:
   Install the Supabase CLI, authenticate, and sync development files:
   
   supabase init
   supabase link --project-ref your-project-id
   
   4. Synchronize DB Schema:
   
   supabase db push
   
   5. Execute Application Server:
   
   bun run dev
   
   The application will boot on your local server port (typically http://localhost:5173).

------------------------------

