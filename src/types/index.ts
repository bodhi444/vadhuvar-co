export type ProjectCategory = 
  | "All"
  | "Commercial"
  | "Concert Video"
  | "Podcast"
  | "Photography"
  | "Fine Art"
  | "Wedding";

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: "Commercial" | "Concert Video" | "Podcast" | "Photography" | "Fine Art" | "Wedding" | string;
  short_description: string;
  full_description: string;
  thumbnail_url: string;
  gallery_images: string[];
  video_url?: string;
  youtube_url?: string;
  vimeo_url?: string;
  year: string;
  client?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  image_url: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  id: string;
  hero_heading: string;
  hero_subheading: string;
  hero_video_url?: string;
  hero_image_fallback: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  show_services: boolean;
  show_portfolio: boolean;
  show_showreel: boolean;
  show_about: boolean;
  show_contact: boolean;
  updated_at: string;
}

export interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location?: string;
  description?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  boardOrUniversity?: string;
  year?: string;
  details?: string;
}

export interface SkillCategoryItem {
  title: string;
  items: string[];
}

export interface AboutContent {
  id: string;
  heading: string;
  intro: string;
  story: string;
  philosophy: string;
  approach: string;
  image_url: string;
  video_url?: string;
  stats: StatItem[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills_categories?: SkillCategoryItem[];
  software_tools?: string[];
  updated_at: string;
}

export interface Showreel {
  id: string;
  title: string;
  video_url?: string;
  youtube_url?: string;
  vimeo_url?: string;
  poster_url: string;
  is_active: boolean;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string;
  logo_url?: string;
  favicon_url?: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  vimeo_url: string;
  seo_title: string;
  seo_description: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  file_type: "image" | "video";
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  created_at: string;
}
