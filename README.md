# FRAME / MOTION — Cinematic Video Production Website & Admin CMS

A high-end, production-ready cinematic film studio website and Content Management System (CMS) built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and a unified PostgreSQL/Supabase database engine.

---

## 🎬 1. Visual Identity & Design Direction

- **Brand Name**: FRAME / MOTION
- **Industry**: Film Production, Cinematography, Commercial Advertising, Luxury Wedding Films, Music Videos, Feature Documentaries.
- **Aesthetic Palette**:
  - Dark Studio Background: `#090A0D`
  - Elevated Cards / Surfaces: `#12141A` / `#161922`
  - Master Gold Accent: `#C9A35E`
  - Gold Glow / Hover: `#DFC283`
  - Border Accents: `#232733` & `rgba(201, 163, 94, 0.25)`
  - Typography: Editorial Cinzel Display serif & Inter sans-serif
  - Signature Aperture vector branding

---

## 🌐 2. Application Architecture

```
/src
├── app/
│   ├── page.tsx                  # Cinematic Homepage (Hero, Services, Portfolio, Showreel, About, Contact)
│   ├── work/
│   │   ├── page.tsx              # Complete Filmography Archive with Category Filtering
│   │   └── [slug]/page.tsx       # Cinematic Project Detail View with 4K Video Player & Stills Wall
│   ├── services/page.tsx         # Detailed Breakdown of Studio Production Disciplines
│   ├── about/page.tsx            # Studio Story, Philosophy, Approach, and Verified Metrics
│   ├── contact/page.tsx          # Production Inquiry Page with WhatsApp Direct & Interactive Form
│   ├── admin/
│   │   ├── login/page.tsx        # Secure Admin Portal (JWT session cookies, password show/hide, forgot modal)
│   │   ├── dashboard/page.tsx    # Studio Overview (Stats summary, recent films, live inquiry feed)
│   │   ├── homepage/page.tsx     # Homepage Editor (Headings, hero video/image, CTAs, section toggles)
│   │   ├── services/page.tsx     # Services Manager (Add, edit, delete, reorder, upload covers)
│   │   ├── portfolio/page.tsx    # Portfolio CMS (Add films, upload 4K stills, YouTube/Vimeo/MP4, slug, draft toggle)
│   │   ├── showreel/page.tsx     # Showreel Controls (Widescreen video, poster, YouTube/Vimeo embeds)
│   │   ├── about/page.tsx        # About Manager (Manifesto, philosophy, approach, stats editor)
│   │   ├── media/page.tsx        # Central Media Library (Upload MP4/JPG/PNG/WebP, preview, copy URL, size/date)
│   │   ├── messages/page.tsx     # Inquiries Inbox (Mark read/unread, detail modal, email responder, delete)
│   │   └── settings/page.tsx     # Global Website Settings (Branding, email, WhatsApp, socials, SEO)
│   └── api/                      # 13 Authenticated & Public REST API Route Handlers
├── components/
│   ├── public/                   # Public cinematic components (Navigation, Hero, Services, Portfolio, etc.)
│   ├── admin/                    # CMS components (Sidebar, Header, MediaUploader, ConfirmModal, Toast)
│   └── shared/                   # Shared utilities (VideoPlayer with MP4/YouTube/Vimeo, ApertureIcon)
├── lib/
│   ├── db/                       # Unified Data Engine (Supabase PostgreSQL + atomic persistent fallback)
│   ├── auth/                     # Server-side JWT session creation, verification & cookies
│   └── supabase/                 # Supabase client (browser) and server client (cookies)
├── middleware.ts                 # Route protection for all /admin/* paths
└── types/                        # Comprehensive TypeScript schemas
```

---

## 🔐 3. Default Admin Access

- **Login Route**: `/admin/login`
- **Email**: `admin@framemotion.com`
- **Password**: `cinematic2025!`

*All `/admin/*` routes are guarded by server-side middleware and encrypted HTTP-only session cookies.*

---

## 💾 4. Database Setup (Supabase & Local Engine)

The system features a **Unified Data Access Engine** (`src/lib/db/index.ts`):
1. **Out of the box**: Operates on an atomic persistent database (`src/data/db.json`), persisting all edits, additions, media uploads, and message submissions immediately across server restarts.
2. **Supabase PostgreSQL Integration**:
   - Provide your Supabase credentials in `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```
   - Run the provided SQL migration in your Supabase SQL editor:
     `supabase/schema.sql` (Creates all tables, Row Level Security policies, and storage bucket permissions).

---

## 🚀 5. Development & Production Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Start production server
npm start
```
