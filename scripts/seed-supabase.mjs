import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.VITE_SUPABASE_URL?.trim();
const anon = process.env.VITE_SUPABASE_ANON_KEY?.trim();
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim();
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD?.trim();

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

if (!isHttpUrl(url) || !anon) throw new Error("Set a valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");

const supabase = createClient(url, serviceRole || anon, {
  auth: { persistSession: false, autoRefreshToken: false }
});

if (!serviceRole) {
  if (!adminEmail || !adminPassword) throw new Error("Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ADMIN_EMAIL/SUPABASE_ADMIN_PASSWORD.");
  const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
  if (error) throw error;
}

const services = [
  ["residential-solar", "Residential Solar Rooftop Solutions", "Residential Solar", "Solar for premium homes", "/images/project-residential.png"],
  ["commercial-solar", "Commercial Solar Rooftop Solutions", "Commercial Solar", "Solar for business spaces", "/images/project-commercial.png"],
  ["industrial-solar", "Industrial Solar Rooftop Solutions", "Industrial Solar", "Solar for heavy energy users", "/images/solglow-hero.png"],
  ["on-grid-solar-plants", "On-Grid Solar Power Plants", "On-Grid Plants", "Grid-connected performance", "/images/service-on-grid.png"],
  ["off-grid-solar-plants", "Off-Grid Solar Power Plants", "Off-Grid Plants", "Independent energy systems", "/images/service-off-grid.png"],
  ["solar-water-heaters", "Solar Water Heaters", "Water Heaters", "Solar thermal efficiency", "/images/service-water-heater.png"],
  ["solar-street-lights", "Solar Street Lights", "Street Lights", "Clean outdoor lighting", "/images/service-street-lights.png"],
  ["backup-solutions-batteries", "Backup Solutions & Batteries", "Backup & Batteries", "Reliable power continuity", "/images/service-off-grid.png"]
];

const faqs = [
  ["home", "What does Solglow help with?", "Solglow supports rooftop solar, on-grid and off-grid plants, solar water heaters, street lights, backup systems and batteries for homes, businesses and industries."],
  ["home", "How does a consultation begin?", "The team reviews your location, usage pattern, roof or site condition and savings goal before suggesting a practical clean-energy path."],
  ["about", "Where is Solglow based?", "Solglow Power Solutions Pvt Ltd operates from Kochi with service presence across Kerala, including Trivandrum, Thrissur and Kozhikode regions."],
  ["projects-gallery", "Which categories matter most?", "Residential rooftops, commercial buildings, industrial rooftops, on-grid plants, off-grid systems, water heating and street lighting."],
  ["why-solar", "Is solar only for high electricity users?", "No. Solar can support homes, shops, offices, institutions and industrial users when the system is sized around actual consumption."],
  ["contact", "What should I share before a callback?", "Share your location, approximate electricity bill, roof or site type, preferred service and whether savings or backup is the priority."]
];

async function upsert(table, row, onConflict) {
  const { error } = await supabase.from(table).upsert(row, { onConflict }).select("id").single();
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function insertIfMissing(table, match, row) {
  let query = supabase.from(table).select("id").limit(1);
  for (const [key, value] of Object.entries(match)) query = query.eq(key, value);
  const { data, error } = await query;
  if (error) throw new Error(`${table}: ${error.message}`);
  if (data?.length) return;
  const { error: insertError } = await supabase.from(table).insert(row);
  if (insertError) throw new Error(`${table}: ${insertError.message}`);
}

await upsert("hero_sections", {
  page_key: "home",
  title: "Powering Homes, Businesses & Industries with Smarter Solar Energy",
  eyebrow: "Premium solar energy company in Kochi, Kerala",
  subtitle: "Premium rooftop solar, solar plants, backup solutions, solar water heaters and clean energy systems designed for long-term performance.",
  image_url: "/images/solglow-hero.png",
  is_published: true
}, "page_key");

for (const [page_key, title, eyebrow, subtitle, image_url] of [
  ["about", "A Kerala-based solar company with a global, premium service mindset.", "About Solglow", "Solglow Power Solutions Pvt Ltd helps homes, businesses and industries reduce energy costs and move toward reliable sustainable power.", "/images/project-commercial.png"],
  ["projects-gallery", "A premium gallery system ready for real Solglow installations.", "Projects / Gallery", "Use these polished placeholders now, then replace them with verified residential, commercial and industrial project images as the portfolio grows.", "/images/project-residential.png"],
  ["why-solar", "Solar is no longer optional for smart energy users.", "Why solar", "It reduces power bills, improves energy independence, supports sustainability and creates a better long-term energy position for homes and businesses.", "/images/service-on-grid.png"],
  ["contact", "Talk to Solglow about your solar project.", "Contact us", "Get professional guidance for rooftop solar, solar plants, water heaters, street lights, backup solutions and batteries.", "/images/service-water-heater.png"]
]) await upsert("hero_sections", { page_key, title, eyebrow, subtitle, image_url, is_published: true }, "page_key");

await upsert("homepage_sections", {
  slug: "brand-promise",
  title: "A solar partner that feels professional before, during and after installation.",
  subtitle: "Brand promise",
  body: "Solglow Power Solutions Pvt Ltd helps residential, commercial and industrial customers move from high electricity costs to clean, reliable and intelligently planned solar power.",
  image_url: "/images/solglow-mark.png",
  is_published: true
}, "slug");

await upsert("about_sections", {
  slug: "who-we-are",
  title: "A complete solar solutions partner from Kochi.",
  subtitle: "Who we are",
  body: "Solglow delivers residential, commercial and industrial solar rooftop solutions, on-grid and off-grid solar power plants, solar water heaters, solar street lights, backup solutions and batteries.",
  image_url: "/images/project-commercial.png",
  is_published: true
}, "slug");

for (const [slug, title, nav_label, eyebrow, image_url] of services) {
  await upsert("services", {
    slug,
    title,
    nav_label,
    eyebrow,
    image_url,
    summary: `${title} planned around real site performance, quality components, safe installation and long-term support.`,
    body: "Solglow reviews usage pattern, site condition, available space, support expectations and future expansion before recommending a configuration.",
    benefits: ["Customized planning", "Quality products", "Reliable installation", "Long-term support"],
    faqs: [{ question: `Who is ${title.toLowerCase()} best for?`, answer: "Customers who want a practical, reliable clean-energy solution designed around real site conditions." }],
    is_published: true
  }, "slug");
}

for (const [title, project_type, image_url] of [
  ["Residential rooftop installations", "Residential", "/images/project-residential.png"],
  ["Commercial and industrial arrays", "Commercial", "/images/project-commercial.png"],
  ["Grid-connected solar plants", "On-grid", "/images/service-on-grid.png"]
]) {
  await insertIfMissing("projects", { title }, { title, project_type, image_url, description: "Solglow project portfolio item ready for detailed CMS expansion.", status: "completed", is_published: true });
  await insertIfMissing("gallery_items", { title }, { title, category: project_type, image_url, alt_text: title, description: "Solglow clean-energy installation visual.", is_published: true });
}

for (const [page_key, title, answer] of faqs) {
  await insertIfMissing("faqs", { page_key, title }, { page_key, title, answer, is_published: true });
}

for (const [key, title, value] of [
  ["company", "Company", "Solglow Power Solutions Pvt Ltd"],
  ["address", "Address", "No.52/2321A, Pallathusseri Building, Adjacent to Hotel Broad Bean, Sahakarana Road, Vyttila Kochi, Kerala, India 682019"],
  ["phone", "Phone", "0484 2940532"],
  ["mobile", "Mobile", "9847055764"],
  ["email", "Email", "info@solglowpowers.com"],
  ["website", "Website", "www.solglowpowers.com"],
  ["director", "Director", "DR GOPAL SHANKAR"]
]) await upsert("contact_details", { key, title, value, is_published: true }, "key");

for (const [platform, title, urlValue, icon] of [
  ["facebook", "Facebook", "https://www.facebook.com/solglowpowers", "facebook"],
  ["instagram", "Instagram", "https://www.instagram.com/solglowpower", "instagram"],
  ["youtube", "YouTube", "https://www.youtube.com/channel/UCFusZ4dQhMJQFsH0nxsiLoQ", "youtube"]
]) await insertIfMissing("social_links", { platform }, { platform, title, url: urlValue, icon, is_published: true });

for (const [page_key, meta_title, meta_description] of [
  ["home", "Solglow Power Solutions Pvt Ltd | Premium Solar Energy Solutions Kerala", "Residential, commercial and industrial solar rooftop, power plant, water heater, street light, backup and battery solutions from Kochi, Kerala."],
  ["about", "About Solglow | Solar Company Kochi Kerala", "Learn about Solglow Power Solutions Pvt Ltd, a premium solar company serving homes, businesses and industries."],
  ["projects-gallery", "Solglow Projects Gallery | Solar Installations Kerala", "Explore Solglow solar project categories across residential, commercial, industrial and clean-energy systems."],
  ["why-solar", "Why Solar | Solglow Power Solutions", "Understand how solar reduces electricity bills, improves energy independence and supports a cleaner future."],
  ["contact", "Contact Solglow | Solar Consultation Kochi", "Contact Solglow for rooftop solar, solar plants, water heaters, street lights, backup systems and batteries."]
]) await upsert("seo_settings", { page_key, title: meta_title, meta_title, meta_description, og_image: "/images/solglow-hero.png", is_published: true }, "page_key");

console.log("Seed complete: Solglow CMS tables now contain current website fallback content.");
