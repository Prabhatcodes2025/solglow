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
  {
    slug: "residential-solar",
    title: "Residential Solar Rooftop Solutions",
    nav_label: "Residential Solar",
    eyebrow: "Solar for premium homes",
    image_url: "/images/project-residential.png",
    summary: "Elegant rooftop solar systems for families who want lower monthly power bills, cleaner energy and dependable support from consultation to maintenance.",
    body: "Solglow designs residential solar around your roof, power usage and savings goal. The result is a clean, durable and low-maintenance solar system that blends with modern homes while delivering practical long-term value.",
    benefits: ["Customized rooftop sizing", "Net-metering focused guidance", "Premium panels and components", "Clean cable routing and installation", "Support for long-term performance", "Ideal for independent homes and villas"],
    metadata: { applications: ["Independent homes", "Villas", "Apartments common loads", "Home offices"], metrics: [["Lower", "monthly bills"], ["Clean", "renewable power"], ["Smart", "roof planning"]], processNote: "We assess roof direction, shadow patterns, daily consumption and future load growth before recommending the right residential solar configuration." }
  },
  {
    slug: "commercial-solar",
    title: "Commercial Solar Rooftop Solutions",
    nav_label: "Commercial Solar",
    eyebrow: "Solar for business spaces",
    image_url: "/images/project-commercial.png",
    summary: "Conversion-focused commercial solar for offices, showrooms, institutions and retail spaces that need measurable energy savings and a professional installation experience.",
    body: "Commercial energy costs directly affect operating margins. Solglow helps businesses use idle rooftop space to generate clean power, reduce grid dependency and create a stronger sustainability profile.",
    benefits: ["Consumption-based system design", "Rooftop utilization planning", "Professional installation workflow", "Scalable system architecture", "Reliable post-installation support", "Ideal for retail and office energy loads"],
    metadata: { applications: ["Offices", "Showrooms", "Schools and institutions", "Hospitality and retail"], metrics: [["Better", "operating savings"], ["Smart", "load planning"], ["Clean", "brand impact"]], processNote: "We align system capacity with business hours, sanctioned load, billing pattern and long-term expansion needs." }
  },
  {
    slug: "industrial-solar",
    title: "Industrial Solar Rooftop Solutions",
    nav_label: "Industrial Solar",
    eyebrow: "Solar for heavy energy users",
    image_url: "/images/solglow-hero.png",
    summary: "Robust solar infrastructure for factories, warehouses and industrial facilities where uptime, safety, scalability and long-term energy economics matter.",
    body: "Industrial solar requires disciplined planning. Solglow approaches every project with attention to roof structure, consumption profile, safety, installation sequencing and long-term return.",
    benefits: ["High-consumption energy analysis", "Factory and warehouse rooftop planning", "Scalable solar plant architecture", "Quality product selection", "Installation coordination", "Performance and maintenance focus"],
    metadata: { applications: ["Factories", "Warehouses", "Manufacturing units", "Industrial campuses"], metrics: [["High", "load planning"], ["Robust", "execution"], ["Long", "term ROI"]], processNote: "We map peak loads, roof zones, access paths and safety requirements so the system is practical for industrial environments." }
  },
  {
    slug: "on-grid-solar-plants",
    title: "On-Grid Solar Power Plants",
    nav_label: "On-Grid Plants",
    eyebrow: "Grid-connected performance",
    image_url: "/images/service-on-grid.png",
    summary: "Grid-connected solar power plants planned for reliable generation, efficient energy offset and a professional path toward lower electricity costs.",
    body: "On-grid solar is ideal when customers want to reduce grid electricity usage while staying connected to the utility network. Solglow helps plan system size, components and execution with a performance-first mindset.",
    benefits: ["Grid-tied solar planning", "Inverter and component guidance", "Energy offset strategy", "Suitable for homes and businesses", "Premium installation approach", "Support for long-term generation"],
    metadata: { applications: ["Homes with grid access", "Commercial rooftops", "Institutions", "Industrial buildings"], metrics: [["Grid", "connected"], ["Smart", "energy offset"], ["ROI", "focused"]], processNote: "We review consumption, roof area, grid connection and expected generation so the plant is sized with financial practicality." }
  },
  {
    slug: "off-grid-solar-plants",
    title: "Off-Grid Solar Power Plants",
    nav_label: "Off-Grid Plants",
    eyebrow: "Independent energy systems",
    image_url: "/images/service-off-grid.png",
    summary: "Independent solar power systems with storage support for locations that need reliable energy beyond conventional grid dependency.",
    body: "Off-grid solar is about resilience. Solglow plans solar generation, battery backup and power conditioning around the real usage pattern of remote homes, facilities and special applications.",
    benefits: ["Solar plus storage planning", "Remote-site suitability", "Backup autonomy guidance", "Battery and inverter coordination", "Reliable system architecture", "Support for critical loads"],
    metadata: { applications: ["Remote homes", "Farms", "Facilities with unreliable grid", "Special power applications"], metrics: [["Energy", "independence"], ["Storage", "ready"], ["Resilient", "power"]], processNote: "We identify critical loads, backup hours, battery requirements and available solar exposure before proposing an off-grid system." }
  },
  {
    slug: "solar-water-heaters",
    title: "Solar Water Heaters",
    nav_label: "Water Heaters",
    eyebrow: "Solar thermal efficiency",
    image_url: "/images/service-water-heater.png",
    summary: "Efficient solar water heating systems for homes, apartments and businesses that want to reduce energy used for daily hot-water demand.",
    body: "Solar water heaters are practical, proven and energy-saving. Solglow helps customers select the right capacity and installation approach based on usage, roof placement and durability expectations.",
    benefits: ["Hot-water demand assessment", "Capacity selection support", "Durable system options", "Clean rooftop installation", "Energy-saving operation", "Suitable for homes and hospitality"],
    metadata: { applications: ["Homes", "Apartments", "Hotels", "Hostels and institutions"], metrics: [["Lower", "heating cost"], ["Daily", "hot water"], ["Low", "maintenance"]], processNote: "We calculate hot-water demand, roof placement and usage pattern so the heater capacity is practical and efficient." }
  },
  {
    slug: "solar-street-lights",
    title: "Solar Street Lights",
    nav_label: "Street Lights",
    eyebrow: "Clean outdoor lighting",
    image_url: "/images/service-street-lights.png",
    summary: "Smart solar street lighting for campuses, roads, communities and commercial spaces that need reliable night lighting with clean energy.",
    body: "Solar street lights improve safety and visibility without heavy cabling dependency. Solglow plans pole placement, illumination coverage and product selection for dependable outdoor use.",
    benefits: ["Lighting layout planning", "Pole and fixture guidance", "Independent solar operation", "Suitable for roads and campuses", "Reliable night-time illumination", "Low operating cost"],
    metadata: { applications: ["Private roads", "Campuses", "Residential communities", "Commercial premises"], metrics: [["Smart", "outdoor light"], ["Solar", "powered"], ["Safe", "campuses"]], processNote: "We review site length, illumination needs, pole spacing and battery autonomy to build a reliable lighting plan." }
  },
  {
    slug: "backup-solutions-batteries",
    title: "Backup Solutions & Batteries",
    nav_label: "Backup & Batteries",
    eyebrow: "Reliable power continuity",
    image_url: "/images/service-off-grid.png",
    summary: "Backup systems and batteries designed to improve energy resilience for homes, offices and business-critical loads.",
    body: "A backup system should match real usage, not guesswork. Solglow helps identify critical loads, backup duration, battery type and solar-ready options for dependable continuity.",
    benefits: ["Critical-load assessment", "Battery selection guidance", "Solar-ready storage planning", "Inverter and backup coordination", "Dependable installation approach", "Support and maintenance focus"],
    metadata: { applications: ["Homes", "Offices", "Small businesses", "Critical backup needs"], metrics: [["Power", "continuity"], ["Battery", "planning"], ["Critical", "loads"]], processNote: "We define what must stay powered, for how long, and how the backup system should integrate with solar or grid supply." }
  }
];

const faqs = [
  ["home", "What does Solglow help with?", "Solglow supports rooftop solar, on-grid and off-grid plants, solar water heaters, street lights, backup systems and batteries for homes, businesses and industries."],
  ["home", "How does a consultation begin?", "The team reviews your location, usage pattern, roof or site condition and savings goal before suggesting a practical clean-energy path."],
  ["about", "Where is Solglow based?", "Solglow Power Solutions Pvt Ltd operates from Kochi with service presence across Kerala, including Trivandrum, Thrissur and Kozhikode regions."],
  ["projects-gallery", "Which categories matter most?", "Residential rooftops, commercial buildings, industrial rooftops, on-grid plants, off-grid systems, water heating and street lighting."],
  ["why-solar", "Is solar only for high electricity users?", "No. Solar can support homes, shops, offices, institutions and industrial users when the system is sized around actual consumption."],
  ["contact", "What should I share before a callback?", "Share your location, approximate electricity bill, roof or site type, preferred service and whether savings or backup is the priority."]
];

const serviceIcons = {
  "residential-solar": "SUN",
  "commercial-solar": "COM",
  "industrial-solar": "IND",
  "on-grid-solar-plants": "GRID",
  "off-grid-solar-plants": "OFF",
  "solar-water-heaters": "HOT",
  "solar-street-lights": "LUX",
  "backup-solutions-batteries": "BAT"
};

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
  cta_label: "Consult. Design. Install. Support.",
  metadata: {
    supportingText: "Every recommendation is shaped by site conditions, consumption pattern, customer goals and support expectations. The experience is built to feel premium, transparent and conversion-friendly from the first enquiry."
  },
  is_published: true
}, "slug");

await upsert("about_sections", {
  slug: "who-we-are",
  title: "A complete solar solutions partner from Kochi.",
  subtitle: "Who we are",
  body: "Solglow delivers residential, commercial and industrial solar rooftop solutions, on-grid and off-grid solar power plants, solar water heaters, solar street lights, backup solutions and batteries.",
  image_url: "/images/project-commercial.png",
  metadata: {
    positioning: "The company is positioned around practical consultation, customized system design, quality product selection, reliable installation and long-term support. The goal is simple: help customers make a confident clean-energy investment.",
    proof: "With a dedicated 25+ member team, 800+ projects delivered and landmark work such as the 180 kW IOCL Parippalli solar project, Solglow brings both technical discipline and regional service reach to Kerala customers.",
    pillars: ["Professional Solar Consultation", "Customized System Design", "Quality Products", "Reliable Installation", "Long-Term Support", "Energy Saving Focus"],
    leadership: [
      {
        name: "Dr. Gopal Shankar - Managing Director",
        role: "Managing Director",
        bio: "Dr. Gopal Shankar, PhD, MBA, brings over 35 years of leadership experience in the power and energy industry. He has held senior positions with Exide Industries Ltd., Standard Batteries Ltd., Tudor India (Exide USA), UPT Batteries Pvt. Ltd. (Kirloskar Group), and Eco Energy Battery Pvt. Ltd. His expertise in manufacturing, business development, and customer relationships drives Solglow's growth and quality commitment."
      },
      {
        name: "Mr. Sharat Varier - Director",
        role: "Director",
        bio: "Mr. Sharat Varier is a Marine Engineer with a B.Tech in Mechanical Engineering from MG University and an MBA. He has experience with Anglo-Eastern Shipping, Shipping Corporation of India, and US Technologies. He supports Solglow's technical execution, project delivery, and operational excellence."
      }
    ]
  },
  is_published: true
}, "slug");

let serviceIndex = 0;
for (const service of services) {
  await upsert("services", {
    ...service,
    icon: serviceIcons[service.slug],
    faqs: [{ question: `Who is ${service.title.toLowerCase()} best for?`, answer: "Customers who want a practical, reliable clean-energy solution designed around real site conditions." }],
    sort_order: serviceIndex,
    is_published: true
  }, "slug");
  await upsert("hero_sections", {
    page_key: service.slug,
    title: service.title,
    eyebrow: service.eyebrow,
    subtitle: service.summary,
    image_url: service.image_url,
    is_published: true,
    sort_order: 20 + serviceIndex
  }, "page_key");
  serviceIndex += 1;
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

for (const testimonial of [
  {
    title: "Residential customer",
    customer_name: "Residential Customer",
    company: "Kochi",
    quote: "Solglow made the solar decision clear from consultation to installation. The team explained the system, savings path and support expectations professionally.",
    rating: 5,
    sort_order: 0,
    is_published: true
  },
  {
    title: "Commercial customer",
    customer_name: "Commercial Customer",
    company: "Kerala",
    quote: "The project approach felt structured and dependable. Site assessment, system planning and execution were handled with a premium service mindset.",
    rating: 5,
    sort_order: 1,
    is_published: true
  }
]) await insertIfMissing("testimonials", { title: testimonial.title, customer_name: testimonial.customer_name }, testimonial);

for (const [key, title, value] of [
  ["company", "Company", "Solglow Power Solutions Pvt Ltd"],
  ["address", "Address", "1st Floor, No. 5/143A, VS Building, Near Metro Pillar P908R, Thykudom, Vyttila, Cochin - 682019"],
  ["phone", "Phone", "0484 2940532"],
  ["mobile", "Mobile", "98470 55764"],
  ["mobile2", "Mobile 2", "80757 65005"],
  ["whatsapp", "WhatsApp", "9847055764"],
  ["email", "Email", "solglowpower@gmail.com"],
  ["website", "Website", "www.solglowpowers.com"],
  ["director", "Managing Director", "Dr. Gopal Shankar"],
  ["director_title", "Director Title", "Managing Director"],
  ["branch_regions", "Branch Regions", "Ernakulam, Trivandrum, Kollam, Thrissur, Calicut"],
  ["footer_description", "Footer Description", "Premium renewable energy solutions for homes, businesses and industries across Kerala, backed by consultation, quality installation and O&M support."],
  ["footer_copyright", "Footer Copyright", "Copyright 2026 Solglow Power Solutions Pvt Ltd. All rights reserved."]
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
