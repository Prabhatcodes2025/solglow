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
  "seo_settings"
];

const results = [];

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

await runStep("verify content tables", async () => {
  for (const table of requiredTables) {
    const { error } = await supabase.from(table).select("id", { count: "exact", head: true });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  pass("verify content tables", `${requiredTables.length} tables reachable`);
});

await runStep("verify enquiries RLS blocks anon select", async () => {
  const { error } = await supabase.from("enquiries").select("id").limit(1);
  if (!error) throw new Error("Anonymous select on enquiries succeeded; expected RLS denial.");
  pass("verify enquiries RLS blocks anon select");
});

await runStep("test enquiry submission", async () => {
  const marker = `Verification ${Date.now()}`;
  const { error } = await supabase.from("enquiries").insert({
    name: marker,
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
      const slug = `verification-${Date.now()}`;
      const { data: created, error: createError } = await adminClient.from("homepage_sections").insert({
        title: "CMS Verification Record",
        slug,
        subtitle: "Automated test",
        body: "Created by scripts/verify-supabase.mjs",
        is_published: false
      }).select().single();
      if (createError) throw createError;
      const { error: updateError } = await adminClient.from("homepage_sections").update({ title: "CMS Verification Updated" }).eq("id", created.id);
      if (updateError) throw updateError;
      const { error: deleteError } = await adminClient.from("homepage_sections").delete().eq("id", created.id);
      if (deleteError) throw deleteError;
      pass("test all CRUD operations", "homepage_sections create/update/delete");
    });

    await runStep("test media upload", async () => {
      const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/l8hwdwAAAABJRU5ErkJggg==";
      const body = Uint8Array.from(Buffer.from(pngBase64, "base64"));
      const path = `verification/${Date.now()}.png`;
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
