import fs from "fs/promises";
import path from "path";
import os from "os";
import bcrypt from "bcryptjs";
import {
  Project,
  Service,
  HomepageContent,
  AboutContent,
  Showreel,
  ContactMessage,
  SiteSettings,
  MediaAsset,
  AdminUser,
} from "@/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "db.json");
const TMP_DB_PATH = path.join(os.tmpdir(), "athul_ollur_db.json");

interface DBData {
  site_settings: SiteSettings;
  homepage_content: HomepageContent;
  services: Service[];
  projects: Project[];
  showreel: Showreel;
  about_content: AboutContent;
  contact_messages: ContactMessage[];
  media_assets: MediaAsset[];
  admin_users: (AdminUser & { password_hash: string })[];
}

// In-memory cache for fast SSR reads with auto-sync
let memoryCache: DBData | null = null;

async function readDB(): Promise<DBData> {
  // 1. Return in-memory cache if available
  if (memoryCache) {
    return memoryCache;
  }

  // 2. Check /tmp fallback (populated in active serverless container)
  try {
    const rawTmp = await fs.readFile(TMP_DB_PATH, "utf-8");
    if (rawTmp && rawTmp.trim().length > 0) {
      memoryCache = JSON.parse(rawTmp);
      return memoryCache!;
    }
  } catch {
    // /tmp file not present yet, continue to bundled DB
  }

  // 3. Read from bundled repository db.json
  try {
    const raw = await fs.readFile(DB_FILE_PATH, "utf-8");
    memoryCache = JSON.parse(raw);
    return memoryCache!;
  } catch (error) {
    if (memoryCache) return memoryCache;
    throw new Error(`Failed to read database: ${error}`);
  }
}

async function writeDB(data: DBData): Promise<void> {
  // Update memory cache immediately
  memoryCache = data;
  const serialized = JSON.stringify(data, null, 2);

  // 1. Attempt writing to local repository file (works in local dev)
  try {
    const tempPath = `${DB_FILE_PATH}.tmp`;
    await fs.writeFile(tempPath, serialized, "utf-8");
    await fs.rename(tempPath, DB_FILE_PATH);
  } catch (err: any) {
    // On Vercel / AWS Lambda, process.cwd() is read-only (EROFS).
    // Never fail or throw an exception on read-only environments.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[db] Local file write notice:", err.message);
    }
  }

  // 2. Always persist to /tmp storage (writable in serverless execution environments)
  try {
    const tmpTemp = `${TMP_DB_PATH}.tmp`;
    await fs.writeFile(tmpTemp, serialized, "utf-8");
    await fs.rename(tmpTemp, TMP_DB_PATH);
  } catch (err: any) {
    console.warn("[db] Temporary storage fallback notice:", err.message);
  }
}

// -------------------------------------------------------------
// SITE SETTINGS
// -------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("site_settings").select("*").single();
      if (!error && data) return data as SiteSettings;
    }
  } catch {
    // fallback to local db
  }
  const db = await readDB();
  return db.site_settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", "default")
        .select()
        .single();
      if (!error && data) return data as SiteSettings;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.site_settings = {
    ...db.site_settings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  await writeDB(db);
  return db.site_settings;
}

// -------------------------------------------------------------
// HOMEPAGE CONTENT
// -------------------------------------------------------------
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("homepage_content").select("*").single();
      if (!error && data) return data as HomepageContent;
    }
  } catch {
    // fallback
  }
  const db = await readDB();
  return db.homepage_content;
}

export async function updateHomepageContent(content: Partial<HomepageContent>): Promise<HomepageContent> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("homepage_content")
        .update({ ...content, updated_at: new Date().toISOString() })
        .eq("id", "default")
        .select()
        .single();
      if (!error && data) return data as HomepageContent;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.homepage_content = {
    ...db.homepage_content,
    ...content,
    updated_at: new Date().toISOString(),
  };
  await writeDB(db);
  return db.homepage_content;
}

// -------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------
export async function getServices(onlyActive = false): Promise<Service[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from("services").select("*").order("display_order", { ascending: true });
      if (onlyActive) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (!error && data) return data as Service[];
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  let list = db.services.sort((a, b) => a.display_order - b.display_order);
  if (onlyActive) {
    list = list.filter((s) => s.is_active);
  }
  return list;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) || null;
}

export async function createService(data: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> {
  const id = `srv-${Date.now()}`;
  const now = new Date().toISOString();
  const newService: Service = {
    ...data,
    id,
    created_at: now,
    updated_at: now,
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: created, error } = await supabase.from("services").insert(newService).select().single();
      if (!error && created) return created as Service;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.services.push(newService);
  await writeDB(db);
  return newService;
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service | null> {
  const now = new Date().toISOString();

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: updated, error } = await supabase
        .from("services")
        .update({ ...data, updated_at: now })
        .eq("id", id)
        .select()
        .single();
      if (!error && updated) return updated as Service;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  const index = db.services.findIndex((s) => s.id === id);
  if (index === -1) return null;

  db.services[index] = {
    ...db.services[index],
    ...data,
    updated_at: now,
  };
  await writeDB(db);
  return db.services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (!error) return true;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  const initLen = db.services.length;
  db.services = db.services.filter((s) => s.id !== id);
  if (db.services.length !== initLen) {
    await writeDB(db);
    return true;
  }
  return false;
}

export async function reorderServices(orderedIds: string[]): Promise<Service[]> {
  const db = await readDB();
  db.services.forEach((s) => {
    const idx = orderedIds.indexOf(s.id);
    if (idx !== -1) {
      s.display_order = idx + 1;
    }
  });
  db.services.sort((a, b) => a.display_order - b.display_order);
  await writeDB(db);
  return db.services;
}

// -------------------------------------------------------------
// PROJECTS (PORTFOLIO)
// -------------------------------------------------------------
export async function getProjects(options?: { onlyPublished?: boolean; category?: string }): Promise<Project[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      let query = supabase.from("projects").select("*").order("display_order", { ascending: true });
      if (options?.onlyPublished) query = query.eq("is_published", true);
      if (options?.category && options.category !== "All") query = query.eq("category", options.category);
      const { data, error } = await query;
      if (!error && data) return data as Project[];
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  let list = db.projects.sort((a, b) => a.display_order - b.display_order);
  if (options?.onlyPublished) {
    list = list.filter((p) => p.is_published);
  }
  if (options?.category && options.category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
  }
  return list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function createProject(data: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
  const id = `proj-${Date.now()}`;
  const now = new Date().toISOString();

  // Ensure unique slug
  let slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) slug = `project-${Date.now()}`;

  const db = await readDB();
  if (db.projects.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const newProject: Project = {
    ...data,
    slug,
    id,
    created_at: now,
    updated_at: now,
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: created, error } = await supabase.from("projects").insert(newProject).select().single();
      if (!error && created) return created as Project;
    }
  } catch {
    // fallback
  }

  db.projects.push(newProject);
  await writeDB(db);
  return newProject;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const now = new Date().toISOString();

  const db = await readDB();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  if (data.slug) {
    let slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (db.projects.some((p) => p.slug === slug && p.id !== id)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    data.slug = slug;
  }

  const updatedProject: Project = {
    ...db.projects[index],
    ...data,
    updated_at: now,
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: updated, error } = await supabase
        .from("projects")
        .update(updatedProject)
        .eq("id", id)
        .select()
        .single();
      if (!error && updated) return updated as Project;
    }
  } catch {
    // fallback
  }

  db.projects[index] = updatedProject;
  await writeDB(db);
  return db.projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (!error) return true;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  const initLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initLen) {
    await writeDB(db);
    return true;
  }
  return false;
}

export async function reorderProjects(orderedIds: string[]): Promise<Project[]> {
  const db = await readDB();
  db.projects.forEach((p) => {
    const idx = orderedIds.indexOf(p.id);
    if (idx !== -1) {
      p.display_order = idx + 1;
    }
  });
  db.projects.sort((a, b) => a.display_order - b.display_order);
  await writeDB(db);
  return db.projects;
}

// -------------------------------------------------------------
// SHOWREEL
// -------------------------------------------------------------
export async function getShowreel(): Promise<Showreel> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("showreel").select("*").single();
      if (!error && data) return data as Showreel;
    }
  } catch {
    // fallback
  }
  const db = await readDB();
  return db.showreel;
}

export async function updateShowreel(data: Partial<Showreel>): Promise<Showreel> {
  const now = new Date().toISOString();
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: updated, error } = await supabase
        .from("showreel")
        .update({ ...data, updated_at: now })
        .eq("id", "default")
        .select()
        .single();
      if (!error && updated) return updated as Showreel;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.showreel = {
    ...db.showreel,
    ...data,
    updated_at: now,
  };
  await writeDB(db);
  return db.showreel;
}

// -------------------------------------------------------------
// ABOUT CONTENT
// -------------------------------------------------------------
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("about_content").select("*").single();
      if (!error && data) return data as AboutContent;
    }
  } catch {
    // fallback
  }
  const db = await readDB();
  return db.about_content;
}

export async function updateAboutContent(data: Partial<AboutContent>): Promise<AboutContent> {
  const now = new Date().toISOString();
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: updated, error } = await supabase
        .from("about_content")
        .update({ ...data, updated_at: now })
        .eq("id", "default")
        .select()
        .single();
      if (!error && updated) return updated as AboutContent;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.about_content = {
    ...db.about_content,
    ...data,
    updated_at: now,
  };
  await writeDB(db);
  return db.about_content;
}

// -------------------------------------------------------------
// CONTACT MESSAGES
// -------------------------------------------------------------
export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as ContactMessage[];
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  return [...db.contact_messages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createContactMessage(
  data: Omit<ContactMessage, "id" | "is_read" | "created_at">
): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: created, error } = await supabase.from("contact_messages").insert(newMsg).select().single();
      if (!error && created) return created as ContactMessage;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.contact_messages.unshift(newMsg);
  await writeDB(db);
  return newMsg;
}

export async function markMessageRead(id: string, is_read: boolean): Promise<ContactMessage | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ is_read })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as ContactMessage;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  const index = db.contact_messages.findIndex((m) => m.id === id);
  if (index === -1) return null;

  db.contact_messages[index].is_read = is_read;
  await writeDB(db);
  return db.contact_messages[index];
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (!error) return true;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  const initLen = db.contact_messages.length;
  db.contact_messages = db.contact_messages.filter((m) => m.id !== id);
  if (db.contact_messages.length !== initLen) {
    await writeDB(db);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// MEDIA ASSETS
// -------------------------------------------------------------
export async function getMediaAssets(): Promise<MediaAsset[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as MediaAsset[];
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  return [...db.media_assets].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createMediaAsset(data: Omit<MediaAsset, "id" | "created_at">): Promise<MediaAsset> {
  const newAsset: MediaAsset = {
    ...data,
    id: `media-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: created, error } = await supabase.from("media_assets").insert(newAsset).select().single();
      if (!error && created) return created as MediaAsset;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  db.media_assets.unshift(newAsset);
  await writeDB(db);
  return newAsset;
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from("media_assets").delete().eq("id", id);
      if (!error) return true;
    }
  } catch {
    // fallback
  }

  const db = await readDB();
  const initLen = db.media_assets.length;
  db.media_assets = db.media_assets.filter((m) => m.id !== id);
  if (db.media_assets.length !== initLen) {
    await writeDB(db);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// DASHBOARD STATS SUMMARY
// -------------------------------------------------------------
export async function getStatsSummary() {
  const [services, projects, media, messages] = await Promise.all([
    getServices(),
    getProjects(),
    getMediaAssets(),
    getContactMessages(),
  ]);

  const unreadMessages = messages.filter((m) => !m.is_read).length;
  const publishedProjects = projects.filter((p) => p.is_published).length;

  return {
    totalProjects: projects.length,
    publishedProjects,
    totalServices: services.length,
    totalMedia: media.length,
    totalMessages: messages.length,
    unreadMessages,
    recentProjects: projects.slice(0, 4),
    recentMessages: messages.slice(0, 5),
  };
}

// -------------------------------------------------------------
// ADMIN AUTH VERIFICATION
// -------------------------------------------------------------
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const db = await readDB();
  const user = db.admin_users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
  };
}

export async function updateAdminPassword(email: string, newPassword: string): Promise<boolean> {
  const db = await readDB();
  const user = db.admin_users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return false;

  const hash = await bcrypt.hash(newPassword, 10);
  user.password_hash = hash;
  await writeDB(db);
  return true;
}
