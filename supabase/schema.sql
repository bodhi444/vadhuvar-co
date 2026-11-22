-- ==============================================================================
-- FRAME / MOTION — CINEMATIC VIDEO PRODUCTION & FILM STUDIO
-- SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Admins / Editors)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  company_name TEXT NOT NULL DEFAULT 'FRAME / MOTION',
  tagline TEXT DEFAULT 'Cinematic Video Production & Film Studio',
  logo_url TEXT,
  favicon_url TEXT,
  email TEXT NOT NULL DEFAULT 'contact@framemotion.studio',
  phone TEXT NOT NULL DEFAULT '+1 (555) 234-5678',
  whatsapp TEXT DEFAULT '+15552345678',
  address TEXT DEFAULT 'Studio 4, Film District, Los Angeles, CA',
  instagram_url TEXT DEFAULT 'https://instagram.com/framemotion',
  facebook_url TEXT DEFAULT 'https://facebook.com/framemotion',
  youtube_url TEXT DEFAULT 'https://youtube.com/@framemotion',
  vimeo_url TEXT DEFAULT 'https://vimeo.com/framemotion',
  seo_title TEXT DEFAULT 'FRAME / MOTION — Cinematic Video Production & Film Studio',
  seo_description TEXT DEFAULT 'Award-winning video production company creating high-end films, commercials, music videos, and documentaries.',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. HOMEPAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero_heading TEXT NOT NULL DEFAULT 'TELL YOUR STORY THROUGH THE LENS.',
  hero_subheading TEXT NOT NULL DEFAULT 'Creating powerful visuals, unforgettable films and cinematic experiences for brands, people and businesses.',
  hero_video_url TEXT,
  hero_image_fallback TEXT NOT NULL DEFAULT '/works/hero/hero-1.jpg',
  cta_primary_text TEXT NOT NULL DEFAULT 'EXPLORE OUR WORK',
  cta_primary_link TEXT NOT NULL DEFAULT '/work',
  cta_secondary_text TEXT NOT NULL DEFAULT 'CONTACT US',
  cta_secondary_link TEXT NOT NULL DEFAULT '/contact',
  show_services BOOLEAN NOT NULL DEFAULT true,
  show_portfolio BOOLEAN NOT NULL DEFAULT true,
  show_showreel BOOLEAN NOT NULL DEFAULT true,
  show_about BOOLEAN NOT NULL DEFAULT true,
  show_contact BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  image_url TEXT NOT NULL,
  icon TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PROJECTS TABLE (PORTFOLIO)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Wedding', 'Commercial', 'Music Video', 'Documentary', 'Photography')),
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  video_url TEXT,
  youtube_url TEXT,
  vimeo_url TEXT,
  year TEXT NOT NULL DEFAULT '2025',
  client TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PROJECT IMAGES TABLE (Optional individual image relations)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SHOWREEL TABLE
CREATE TABLE IF NOT EXISTS public.showreel (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT NOT NULL DEFAULT 'FRAME / MOTION Official Studio Showreel',
  video_url TEXT,
  youtube_url TEXT DEFAULT 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  vimeo_url TEXT,
  poster_url TEXT NOT NULL DEFAULT '/works/hero/hero-2.jpg',
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ABOUT CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'default',
  heading TEXT NOT NULL DEFAULT 'WE CREATE VISUAL STORIES.',
  intro TEXT NOT NULL DEFAULT 'FRAME / MOTION is an independent cinematic film production studio dedicated to crafting evocative visual narratives that move audiences and elevate brands.',
  story TEXT NOT NULL DEFAULT 'Founded by filmmakers obsessed with lighting, pacing, and human emotion, we combine Hollywood-caliber camera movement with raw authentic narrative pacing. From remote mountain documentaries to high-fashion commercial sets, our lenses capture the profound in every single frame.',
  philosophy TEXT NOT NULL DEFAULT 'Cinema is not just about resolution or camera rigs — it is the alchemy of light, rhythm, silence, and truth. We believe every brand, couple, and story possesses a soul waiting to be immortalized.',
  approach TEXT NOT NULL DEFAULT 'We approach every production with bespoke artistry: deep pre-production visual scripting, state-of-the-art camera systems, precision color grading in DaVinci Resolve, and custom symphonic sound design.',
  image_url TEXT NOT NULL DEFAULT '/works/portraits/portrait-1.jpg',
  video_url TEXT,
  stats JSONB NOT NULL DEFAULT '[
    {"label": "Films Produced", "value": "180", "suffix": "+"},
    {"label": "Global Awards", "value": "14", "suffix": ""},
    {"label": "Countries Filmed", "value": "22", "suffix": ""},
    {"label": "Client Satisfaction", "value": "99.8", "suffix": "%"}
  ]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showreel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view homepage content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Public can view showreel" ON public.showreel FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view about content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);

-- PUBLIC WRITE POLICY FOR CONTACT INQUIRIES
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS POLICIES (AUTHENTICATED USERS)
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to homepage_content" ON public.homepage_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to project_images" ON public.project_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to showreel" ON public.showreel FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to about_content" ON public.about_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins have full access to media_assets" ON public.media_assets FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Execute in Supabase Storage SQL Editor)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media bucket" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'uploads'));
CREATE POLICY "Authenticated users can upload to media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('media', 'uploads'));
CREATE POLICY "Authenticated users can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('media', 'uploads'));
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('media', 'uploads'));
