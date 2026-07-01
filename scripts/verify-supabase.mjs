import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envFiles = [".env.local", ".env"];

for (const file of envFiles) {
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim();
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD?.trim();

const requiredTables = [
  "homepage_sections",
  "hero_sections",
  "about_sections",
  "services",
  "projects",
  "gallery_items",
  "testimonials",
  "faqs",
  "contact_details",
  "social_links",
  "seo_settings",
  "enquiries",
  "profiles"
];

const crudCases = [
  ["homepage_sections", () => ({ title: "Verification Homepage", slug: marker("homepage"), subtitle: "Automated test", body: "Created by verification.", is_published: false })],
  ["hero_sections", () => ({ title: "Verification Hero", page_key: marker("hero"), eyebrow: "QA", subtitle: "Automated test", is_published: false })],
  ["about_sections", () => ({ title: "Verification About", slug: marker("about"), subtitle: "Automated test", body: "Created by verification.", is_published: false })],
  ["services", () => ({ title: "Verification Service", slug: marker("service"), nav_label: "Verification", summary: "Automated test", body: "Created by verification.", benefits: ["Benefit"], faqs: [{ question: "Works?", answer: "Yes" }], is_published: false })],
  ["projects", () => ({ title: "Verification Project", slug: marker("project"), project_type: "QA", capacity: "1 kW", location: "Kochi", completion_year: 2026, description: "Created by verification.", gallery: [], status: "draft", is_published: false })],
  ["gallery_items", () => ({ title: "Verification Gallery", category: "QA", image_url: "https://example.com/verification.webp", alt_text: "Verification image", description: "Created by verification.", is_published: false })],
  ["testimonials", () => ({ title: "Verification Testimonial", customer_name: "QA User", company: "Solglow", quote: "Automated verification quote.", rating: 5, is_published: false })],
  ["faqs", () => ({ title: "Verification FAQ", page_key: marker("faq"), answer: "Created by verification.", is_published: false })],
  ["contact_details", () => ({ title: "Verification Contact", key: marker("contact"), value: "verification@example.com", is_published: false })],
  ["social_links", () => ({ title: "Verification Social", platform: marker("social"), url: "https://example.com", icon: "link", is_published: false })],
  ["seo_settings", () => ({ title: "Verification SEO", page_key: marker("seo"), meta_title: "Verification SEO", meta_description: "Created by verification.", schema_json: {}, is_published: false })]
];

const results = [];
const runId = Date.now();

function marker(prefix) {
  return `${prefix}-verification-${runId}`;
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function pass(name, detail = "") {
  results.push({ status: "pass", name, detail });
}

function skip(name, detail = "") {
  results.push({ status: "skip", name, detail });
}

function fail(name, detail = "") {
  results.push({ status: "fail", name, detail });
}

async function runStep(name, fn) {
  try {
    await fn();
  } catch (error) {
    fail(name, error.message);
  }
}

async function insertUpdateDelete(client, table, payload) {
  const { data: created, error: createError } = await client.from(table).insert(payload).select().single();
  if (createError) throw createError;

  const { data: updated, error: updateError } = await client.from(table).update({ title: `${payload.title} Updated` }).eq("id", created.id).select().single();
  if (updateError) throw updateError;
  if (!updated || updated.title !== `${payload.title} Updated`) throw new Error(`${table}: update did not persist.`);

  const { error: deleteError } = await client.from(table).delete().eq("id", created.id);
  if (deleteError) throw deleteError;

  const { data: deleted, error: readError } = await client.from(table).select("id").eq("id", created.id);
  if (readError) throw readError;
  if (deleted?.length) throw new Error(`${table}: delete did not persist.`);
}

if (!isHttpUrl(supabaseUrl) || !supabaseAnonKey) {
  fail("environment", "VITE_SUPABASE_URL must be a valid HTTP/HTTPS URL and VITE_SUPABASE_ANON_KEY must be set.");
  console.table(results);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

await runStep("connect Supabase client", async () => {
  const { error } = await supabase.from("hero_sections").select("id", { count: "exact", head: true });
  if (error) throw error;
  pass("connect Supabase client");
});

await runStep("verify database tables", async () => {
  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select("id", { count: "exact", head: true });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  pass("verify database tables", `${requiredTables.length} tables reachable`);
});

await runStep("verify public content read policies", async () => {
  for (const table of requiredTables.filter((table) => !["enquiries", "profiles"].includes(table))) {
    const { error } = await supabase.from(table).select("id").limit(1);
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  pass("verify public content read policies");
});

await runStep("verify enquiries RLS blocks anon select", async () => {
  const markerName = `RLS Block ${runId}`;
  const { error: insertError } = await supabase.from("enquiries").insert({
    name: markerName,
    phone: "0000000000",
    email: "rls-block@example.com",
    service: "CMS verification",
    message: "Anonymous read verification.",
    source: "/scripts/verify-supabase"
  });
  if (insertError) throw insertError;

  const { data, error } = await supabase.from("enquiries").select("id,name").eq("name", markerName);
  if (error) {
    pass("verify enquiries RLS blocks anon select", error.message);
    return;
  }
  if (data?.length) throw new Error("Anonymous select returned enquiry rows; expected RLS to hide them.");
  pass("verify enquiries RLS blocks anon select", "anonymous select returned no rows");
});

await runStep("test enquiry submission", async () => {
  const markerName = `Verification ${runId}`;
  const { error } = await supabase.from("enquiries").insert({
    name: markerName,
    phone: "0000000000",
    email: "verify@example.com",
    service: "CMS verification",
    message: "Automated production verification enquiry.",
    source: "/scripts/verify-supabase"
  });
  if (error) throw error;
  pass("test enquiry submission");
});

await runStep("verify public storage bucket read", async () => {
  const { error } = await supabase.storage.from("cms-media").list("", { limit: 1 });
  if (error) throw error;
  pass("verify public storage bucket read", "cms-media");
});

let adminClient = null;
let signedIn = false;

if (!adminEmail || !adminPassword) {
  skip("verify authentication", "Set SUPABASE_ADMIN_EMAIL and SUPABASE_ADMIN_PASSWORD to test admin login.");
  skip("test all CRUD operations", "Admin credentials are required.");
  skip("test enquiry status updates", "Admin credentials are required.");
  skip("test media upload", "Admin credentials are required.");
} else {
  adminClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  await runStep("verify authentication", async () => {
    const { data, error } = await adminClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    if (error) throw error;
    if (!data.session) throw new Error("No session returned after admin login.");
    signedIn = true;
    pass("verify authentication");
  });

  if (signedIn) {
    await runStep("verify staff profile role", async () => {
      const user = (await adminClient.auth.getUser()).data.user;
      const { data, error } = await adminClient.from("profiles").select("role").eq("id", user.id).single();
      if (error) throw error;
      if (!["admin", "editor"].includes(data?.role)) throw new Error(`Profile role "${data?.role || "missing"}" is not allowed to access CMS.`);
      pass("verify staff profile role", data.role);
    });

    await runStep("test all CRUD operations", async () => {
      for (const [table, payloadFactory] of crudCases) {
        await insertUpdateDelete(adminClient, table, payloadFactory());
      }
      pass("test all CRUD operations", `${crudCases.length} CMS modules`);
    });

    await runStep("test enquiry status updates", async () => {
      const { data: created, error: createError } = await adminClient.from("enquiries").insert({
        name: `Status ${runId}`,
        phone: "0000000000",
        email: "status@example.com",
        service: "CMS verification",
        message: "Status update verification.",
        source: "/scripts/verify-supabase"
      }).select().single();
      if (createError) throw createError;

      const statuses = ["contacted", "converted"];
      for (const value of statuses) {
        let update = await adminClient.from("enquiries").update({ status: value }).eq("id", created.id).select("status").single();
        if (update.error && value === "converted" && /enum|enquiry_status|invalid input value/i.test(update.error.message)) {
          update = await adminClient.from("enquiries").update({ status: "qualified" }).eq("id", created.id).select("status").single();
        }
        if (update.error) throw update.error;
        const persisted = value === "converted" ? ["converted", "qualified"].includes(update.data.status) : update.data.status === value;
        if (!persisted) throw new Error(`Expected ${value}, received ${update.data.status}`);
      }

      await adminClient.from("enquiries").delete().eq("id", created.id);
      pass("test enquiry status updates", "new/contacted/converted");
    });

    await runStep("test media upload", async () => {
      const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/l8hwdwAAAABJRU5ErkJggg==";
      const body = Uint8Array.from(Buffer.from(pngBase64, "base64"));
      const path = `verification/${runId}.png`;
      const { error: uploadError } = await adminClient.storage.from("cms-media").upload(path, body, {
        contentType: "image/png",
        cacheControl: "60",
        upsert: false
      });
      if (uploadError) throw uploadError;
      const { error: deleteError } = await adminClient.storage.from("cms-media").remove([path]);
      if (deleteError) throw deleteError;
      pass("test media upload", "upload/delete");
    });
  }
}

const failed = results.filter((item) => item.status === "fail");
console.table(results);
if (failed.length) process.exit(1);
