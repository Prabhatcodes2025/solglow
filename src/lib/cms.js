import { supabase } from "./supabase";

export const MODULES = {
  homepage: "homepage_sections",
  heroes: "hero_sections",
  about: "about_sections",
  services: "services",
  projects: "projects",
  gallery: "gallery_items",
  testimonials: "testimonials",
  faq: "faqs",
  contact: "contact_details",
  social: "social_links",
  seo: "seo_settings"
};

export async function getPublishedContent() {
  if (!supabase) return {};
  const pairs = await Promise.all(Object.entries(MODULES).map(async ([key, table]) => {
    const { data, error } = await supabase.from(table).select("*").eq("is_published", true).order("sort_order");
    if (error) {
      console.error(`[CMS] Failed to load published content from ${table}`, error);
      return [key, []];
    }
    return [key, data || []];
  }));
  return Object.fromEntries(pairs);
}

export async function submitEnquiry(payload) {
  if (!supabase) throw new Error("Online enquiry storage is not configured yet. Please call or WhatsApp Solglow.");
  const { error } = await supabase.from("enquiries").insert({ ...payload, source: window.location.pathname });
  if (error) {
    console.error("[CMS] Failed to submit enquiry", error);
    throw error;
  }
}

export async function listRows(table, search = "") {
  if (!supabase) return [];
  let query = supabase.from(table).select("*").order("updated_at", { ascending: false });
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query;
  if (error) {
    console.error(`[CMS] Failed to list ${table}`, error);
    throw error;
  }
  return data || [];
}

export async function saveRow(table, row) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const clean = Object.fromEntries(Object.entries(row).filter(([key]) => !["created_at", "updated_at"].includes(key)));
  const query = clean.id
    ? supabase.from(table).update(clean).eq("id", clean.id)
    : supabase.from(table).insert(clean);
  const { data, error } = await query.select().single();
  if (error) {
    console.error(`[CMS] Failed to save ${table}`, error);
    throw error;
  }
  return data;
}

export async function deleteRow(table, id) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[CMS] Failed to delete ${table}`, error);
    throw error;
  }
}

export async function uploadMedia(file, folder = "general") {
  if (!supabase) throw new Error("Supabase is not configured.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("cms-media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) {
    console.error("[CMS] Failed to upload media", error);
    throw error;
  }
  return supabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl;
}

export async function listMedia() {
  if (!supabase) return [];
  const { data: folders, error } = await supabase.storage.from("cms-media").list("", { limit: 100 });
  if (error) {
    console.error("[CMS] Failed to list media", error);
    throw error;
  }
  const groups = await Promise.all((folders || []).map(async (folder) => {
    const { data } = await supabase.storage.from("cms-media").list(folder.name, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    return (data || []).filter((item) => item.id).map((item) => {
      const path = `${folder.name}/${item.name}`;
      return { ...item, path, url: supabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl };
    });
  }));
  return groups.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function deleteMedia(path) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.storage.from("cms-media").remove([path]);
  if (error) {
    console.error("[CMS] Failed to delete media", error);
    throw error;
  }
}
