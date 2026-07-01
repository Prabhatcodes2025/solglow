import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3, ChevronLeft, CircleHelp, FileImage, FolderKanban, Home, Image, LayoutDashboard,
  LoaderCircle, LogOut, Menu, MessageSquareQuote, Moon, PanelTop, Pencil, Plus, Search,
  Settings, Share2, ShieldCheck, Sun, Trash2, Upload, Users, X, Zap
} from "lucide-react";
import { MODULES, deleteMedia, deleteRow, listMedia, listRows, saveRow, uploadMedia } from "../lib/cms";
import { cmsStatus, isSupabaseConfigured, supabase } from "../lib/supabase";
import "./admin.css";

const moduleConfig = {
  homepage: { label: "Homepage", icon: Home, fields: ["title", "slug", "subtitle", "body", "image_url", "cta_label", "cta_url", "sort_order", "is_published"] },
  heroes: { label: "Hero", icon: PanelTop, fields: ["title", "page_key", "eyebrow", "subtitle", "image_url", "cta_label", "cta_url", "sort_order", "is_published"] },
  about: { label: "About", icon: Users, fields: ["title", "slug", "subtitle", "body", "image_url", "sort_order", "is_published"] },
  services: { label: "Services", icon: Zap, fields: ["title", "slug", "nav_label", "eyebrow", "summary", "body", "image_url", "icon", "benefits", "faqs", "cta_label", "cta_url", "sort_order", "is_published"] },
  projects: { label: "Projects", icon: FolderKanban, fields: ["title", "slug", "project_type", "capacity", "location", "completion_year", "description", "image_url", "gallery", "status", "sort_order", "is_published"] },
  gallery: { label: "Gallery", icon: Image, fields: ["title", "category", "image_url", "alt_text", "description", "sort_order", "is_published"] },
  testimonials: { label: "Testimonials", icon: MessageSquareQuote, fields: ["title", "customer_name", "company", "quote", "rating", "image_url", "sort_order", "is_published"] },
  faq: { label: "FAQ", icon: CircleHelp, fields: ["title", "page_key", "answer", "sort_order", "is_published"] },
  contact: { label: "Contact Details", icon: Settings, fields: ["title", "key", "value", "sort_order", "is_published"] },
  social: { label: "Social Links", icon: Share2, fields: ["title", "platform", "url", "icon", "sort_order", "is_published"] },
  seo: { label: "SEO Settings", icon: BarChart3, fields: ["title", "page_key", "meta_title", "meta_description", "canonical_url", "og_image", "schema_json", "sort_order", "is_published"] }
};

const jsonFields = new Set(["benefits", "faqs", "gallery", "schema_json", "metadata"]);
const multilineFields = new Set(["body", "summary", "description", "quote", "answer", "meta_description", ...jsonFields]);
const mediaFields = new Set(["image_url", "og_image"]);
const emptyRow = (fields) => Object.fromEntries(fields.map((field) => [field, field === "is_published" ? true : field === "sort_order" ? 0 : field === "schema_json" ? "{}" : jsonFields.has(field) ? "[]" : ""]));
const titleize = (value) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const enquiryStatuses = [
  ["new", "New"],
  ["contacted", "Contacted"],
  ["converted", "Converted"],
  ["closed", "Closed"]
];
const normalizeEnquiryStatus = (value) => value === "qualified" ? "converted" : value;
const statusLabel = (value) => enquiryStatuses.find(([key]) => key === normalizeEnquiryStatus(value))?.[1] || titleize(value || "new");

async function compressImage(file) {
  if (!file.type.startsWith("image/") || file.size < 500000) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.84));
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
}

function AuthScreen({ recovery, onRecoveryComplete }) {
  const [mode, setMode] = useState(recovery ? "reset" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
        if (error) throw error;
        setMessage("Password reset link sent. Check your inbox.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Password updated successfully."); onRecoveryComplete();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  return <main className="admin-auth">
    <section className="auth-brand"><img src="/images/solglow-mark.png" alt="" /><span>Solglow CMS</span><h1>Power every page from one clear command centre.</h1><p>Secure content, media, enquiries and performance oversight for the Solglow team.</p></section>
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-icon"><ShieldCheck /></div><span className="admin-kicker">Secure administration</span>
      <h2>{mode === "forgot" ? "Forgot password" : mode === "reset" ? "Create new password" : "Welcome back"}</h2>
      <p>{mode === "login" ? "Sign in with your approved Supabase account." : "Use a secure password with at least eight characters."}</p>
      {mode !== "reset" && <label>Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@solglowpowers.com" /></label>}
      {mode !== "forgot" && <label>Password<input type="password" minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" /></label>}
      {message && <div className="auth-message">{message}</div>}
      <button className="admin-primary" disabled={busy}>{busy && <LoaderCircle className="spin" />}{mode === "forgot" ? "Send reset link" : mode === "reset" ? "Update password" : "Sign in"}</button>
      {mode !== "reset" && <button type="button" className="admin-link" onClick={() => setMode(mode === "login" ? "forgot" : "login")}>{mode === "login" ? "Forgot password?" : "Back to sign in"}</button>}
      <a className="back-site" href="/"><ChevronLeft /> Back to website</a>
    </form>
  </main>;
}

function SetupScreen() {
  return <main className="admin-setup"><section><img src="/images/solglow-mark.png" alt="" /><span className="admin-kicker">CMS setup</span><h1>Connect your Supabase project.</h1><p>{cmsStatus.message}</p><div className="setup-fields"><label>VITE_SUPABASE_URL<input value="" readOnly placeholder="https://your-project.supabase.co" /></label><label>VITE_SUPABASE_ANON_KEY<input value="" readOnly placeholder="Your public anon key" /></label></div><ol><li>Create a Supabase project.</li><li>Run <code>supabase/schema.sql</code> in the SQL editor.</li><li>Add both values to local and Vercel environment variables.</li><li>Create the first Auth user and promote its profile to <code>admin</code>.</li></ol><a className="admin-primary" href="/">Return to website</a></section></main>;
}

function AccessDenied({ onSignOut }) {
  return <main className="admin-setup"><section><img src="/images/solglow-mark.png" alt="" /><span className="admin-kicker">Access control</span><h1>Admin access is not enabled for this account.</h1><p>Your Supabase session is valid, but the profile role must be <code>admin</code> or <code>editor</code> before the CMS dashboard can open.</p><button className="admin-primary" onClick={onSignOut}>Sign out</button></section></main>;
}

function Dashboard({ stats, recent }) {
  const cards = [
    ["New enquiries", stats.newEnquiries, MessageSquareQuote, "+ actionable leads"],
    ["Contacted", stats.contactedEnquiries, Users, "follow-ups underway"],
    ["Converted", stats.convertedEnquiries, ShieldCheck, "won opportunities"],
    ["Published projects", stats.projects, FolderKanban, "portfolio records"]
  ];
  return <div className="dashboard-view">
    <div className="admin-welcome"><div><span className="admin-kicker">Live operations</span><h1>Good energy, clearly managed.</h1><p>Content health and customer activity across Solglow.</p></div><a className="admin-primary" href="/" target="_blank" rel="noreferrer">View live site</a></div>
    <div className="dashboard-cards">{cards.map(([label, value, Icon, note]) => <article key={label}><span><Icon /></span><div><strong>{value}</strong><h3>{label}</h3><p>{note}</p></div></article>)}</div>
    <div className="dashboard-grid"><section className="analytics-card"><div className="panel-title"><div><span className="admin-kicker">Enquiry pulse</span><h2>Last seven days</h2></div><BarChart3 /></div><div className="bars">{stats.trend.map((value, index) => <div key={index}><span style={{ height: `${Math.max(10, value * 18)}%` }} /><small>{["M","T","W","T","F","S","S"][index]}</small></div>)}</div></section><section className="recent-card"><div className="panel-title"><div><span className="admin-kicker">Latest activity</span><h2>Recent enquiries</h2></div></div>{recent.length ? recent.map((item) => <article key={item.id}><span>{item.name?.slice(0, 1)}</span><div><strong>{item.name}</strong><small>{item.service}</small></div><em>{statusLabel(item.status)}</em></article>) : <div className="admin-empty">New enquiries will appear here.</div>}</section></div>
  </div>;
}

function Editor({ config, row, close, onSaved }) {
  const [draft, setDraft] = useState(row || emptyRow(config.fields));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const upload = async (field, file) => {
    setBusy(true); setError(""); setSuccess("");
    try { update(field, await uploadMedia(await compressImage(file), config.label.toLowerCase().replaceAll(" ", "-"))); }
    catch (err) { console.error(`[CMS] ${config.label} media upload failed`, err); setError(err.message); } finally { setBusy(false); }
  };
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError(""); setSuccess("");
    try {
      const payload = { ...draft };
      for (const field of jsonFields) if (field in payload && typeof payload[field] === "string") payload[field] = JSON.parse(payload[field] || (field === "schema_json" ? "{}" : "[]"));
      await saveRow(config.table, payload);
      setSuccess("Saved successfully.");
      setBusy(false);
      window.setTimeout(onSaved, 450);
    } catch (err) { console.error(`[CMS] ${config.label} save failed`, err); setError(err.message); setBusy(false); }
  };
  return <div className="admin-modal" role="dialog" aria-modal="true"><form className="editor-panel" onSubmit={submit}><header><div><span className="admin-kicker">{row ? "Edit record" : "Create record"}</span><h2>{config.label}</h2></div><button type="button" onClick={close} aria-label="Close"><X /></button></header><div className="editor-fields">{config.fields.map((field) => {
    if (field === "is_published") return <label className="toggle-field" key={field}><input type="checkbox" checked={Boolean(draft[field])} onChange={(e) => update(field, e.target.checked)} /><span /> Published</label>;
    const value = jsonFields.has(field) && typeof draft[field] !== "string" ? JSON.stringify(draft[field] ?? [], null, 2) : draft[field] ?? "";
    return <label className={multilineFields.has(field) ? "editor-wide" : ""} key={field}>{titleize(field)}{multilineFields.has(field) ? <textarea rows={jsonFields.has(field) ? 6 : 4} value={value} onChange={(e) => update(field, e.target.value)} /> : <input type={["sort_order","rating","completion_year"].includes(field) ? "number" : "text"} required={["title", "page_key", "slug"].includes(field)} value={value} onChange={(e) => update(field, e.target.value)} />}{mediaFields.has(field) && <span className="upload-inline"><Upload /> Upload image<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(field, e.target.files[0])} /></span>}</label>;
  })}</div>{error && <div className="admin-error">{error}</div>}{success && <div className="admin-success">{success}</div>}<footer><button type="button" className="admin-secondary" onClick={close}>Cancel</button><button className="admin-primary" disabled={busy}>{busy && <LoaderCircle className="spin" />}{success ? "Saved" : busy ? "Saving..." : "Save changes"}</button></footer></form></div>;
}

function ModuleManager({ moduleKey, onChanged }) {
  const base = moduleConfig[moduleKey];
  const config = { ...base, table: MODULES[moduleKey] };
  const [rows, setRows] = useState([]); const [search, setSearch] = useState(""); const [editing, setEditing] = useState(null); const [creating, setCreating] = useState(false); const [busy, setBusy] = useState(true); const [error, setError] = useState("");
  const load = async () => { setBusy(true); try { setRows(await listRows(config.table)); setError(""); } catch (err) { console.error(`[CMS] ${config.label} load failed`, err); setError(err.message); } finally { setBusy(false); } };
  useEffect(() => { load(); }, [moduleKey]);
  const visible = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const remove = async (row) => { if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return; try { await deleteRow(config.table, row.id); await load(); onChanged?.(); } catch (err) { console.error(`[CMS] ${config.label} delete failed`, err); setError(err.message); } };
  return <div className="module-view"><div className="module-heading"><div><span className="admin-kicker">Content module</span><h1>{config.label}</h1><p>Create, publish, search and maintain every {config.label.toLowerCase()} record.</p></div><button className="admin-primary" onClick={() => setCreating(true)}><Plus /> Add new</button></div><div className="module-toolbar"><label><Search /><input placeholder={`Search ${config.label.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} /></label><span>{visible.length} records</span></div>{error && <div className="admin-error">{error}</div>}<div className="records">{busy ? <div className="admin-empty"><LoaderCircle className="spin" /> Loading content...</div> : visible.length ? visible.map((row) => <article key={row.id}>{row.image_url && <img src={row.image_url} alt="" />}<div><span className={row.is_published ? "status published" : "status draft"}>{row.is_published ? "Published" : "Draft"}</span><h3>{row.title}</h3><p>{row.summary || row.subtitle || row.description || row.answer || row.value || row.page_key || row.slug || "Ready to edit"}</p><small>Updated {new Date(row.updated_at).toLocaleDateString()}</small></div><div className="record-actions"><button onClick={() => setEditing(row)} aria-label={`Edit ${row.title}`}><Pencil /></button><button onClick={() => remove(row)} aria-label={`Delete ${row.title}`}><Trash2 /></button></div></article>) : <div className="admin-empty">No records yet. Create the first one when you are ready.</div>}</div>{(creating || editing) && <Editor config={config} row={editing} close={() => { setCreating(false); setEditing(null); }} onSaved={() => { setCreating(false); setEditing(null); load(); onChanged?.(); }} />}</div>;
}

function EnquiryManager({ onChanged }) {
  const [rows, setRows] = useState([]); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState(""); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  const load = async () => {
    try {
      setRows(await listRows("enquiries"));
      setError("");
    } catch (err) {
      console.error("[CMS] Enquiries load failed", err);
      setError(err.message);
    }
  };
  useEffect(() => { load(); }, []);
  const filtered = rows.filter((row) => (status === "all" || normalizeEnquiryStatus(row.status) === status) && JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const setRowStatus = async (row, value) => {
    setBusyId(row.id); setError(""); setSuccess("");
    try {
      try {
        await saveRow("enquiries", { ...row, status: value });
      } catch (err) {
        if (value !== "converted" || !/enum|enquiry_status|invalid input value/i.test(err.message || "")) throw err;
        await saveRow("enquiries", { ...row, status: "qualified" });
      }
      await load();
      onChanged?.();
      setSuccess(`${row.name}'s enquiry moved to ${statusLabel(value)}.`);
    } catch (err) {
      console.error("[CMS] Enquiry status update failed", err);
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };
  return <div className="module-view"><div className="module-heading"><div><span className="admin-kicker">Customer pipeline</span><h1>Enquiries</h1><p>Search, qualify and follow every customer conversation.</p></div></div><div className="module-toolbar"><label><Search /><input placeholder="Search enquiries..." value={search} onChange={(e) => setSearch(e.target.value)} /></label><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{enquiryStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>{error && <div className="admin-error">{error}</div>}{success && <div className="admin-success">{success}</div>}<div className="enquiry-table">{filtered.length ? filtered.map((row) => <article key={row.id} className={busyId === row.id ? "is-busy" : ""}><div><strong>{row.name}</strong><a href={`tel:${row.phone}`}>{row.phone}</a><a href={`mailto:${row.email}`}>{row.email}</a></div><div><span>{row.service}</span><p>{row.message}</p><small>{new Date(row.created_at).toLocaleString()}</small></div><label className="enquiry-status"><span>Status</span><select value={normalizeEnquiryStatus(row.status)} disabled={busyId === row.id} onChange={(e) => setRowStatus(row, e.target.value)}>{enquiryStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{busyId === row.id && <small><LoaderCircle className="spin" /> Saving...</small>}</label></article>) : <div className="admin-empty">No enquiries match this view.</div>}</div></div>;
}

function MediaManager() {
  const [items, setItems] = useState([]); const [search, setSearch] = useState(""); const [busy, setBusy] = useState(true); const [error, setError] = useState("");
  const load = async () => { setBusy(true); try { setItems(await listMedia()); setError(""); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  useEffect(() => { load(); }, []);
  const upload = async (files) => { setBusy(true); try { for (const file of files) await uploadMedia(await compressImage(file), "library"); await load(); } catch (err) { setError(err.message); setBusy(false); } };
  const remove = async (item) => { if (!window.confirm(`Delete ${item.name}?`)) return; try { await deleteMedia(item.path); load(); } catch (err) { setError(err.message); } };
  const visible = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  return <div className="module-view"><div className="module-heading"><div><span className="admin-kicker">Supabase Storage</span><h1>Media Manager</h1><p>Compressed, reusable image assets for every CMS module.</p></div><label className="admin-primary media-upload"><Upload /> Upload images<input type="file" multiple accept="image/*" onChange={(e) => e.target.files.length && upload([...e.target.files])} /></label></div><div className="module-toolbar"><label><Search /><input placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} /></label><span>{visible.length} assets</span></div>{error && <div className="admin-error">{error}</div>}{busy ? <div className="admin-empty"><LoaderCircle className="spin" /> Loading media...</div> : <div className="media-grid">{visible.map((item) => <article key={item.path}><img src={item.url} alt={item.name} /><div><strong>{item.name}</strong><small>{Math.round((item.metadata?.size || 0) / 1024)} KB</small></div><button onClick={() => remove(item)} aria-label={`Delete ${item.name}`}><Trash2 /></button></article>)}</div>}</div>;
}

function AdminShell({ session }) {
  const [active, setActive] = useState("dashboard"); const [sidebar, setSidebar] = useState(false); const [theme, setTheme] = useState(localStorage.getItem("solglow-admin-theme") || "dark"); const [refreshKey, setRefreshKey] = useState(0); const [stats, setStats] = useState({ newEnquiries: 0, contactedEnquiries: 0, convertedEnquiries: 0, projects: 0, services: 0, gallery: 0, trend: [0,0,0,0,0,0,0] }); const [recent, setRecent] = useState([]);
  useEffect(() => { localStorage.setItem("solglow-admin-theme", theme); }, [theme]);
  useEffect(() => { (async () => { const [enquiries, projects, services, gallery] = await Promise.all([listRows("enquiries"), listRows("projects"), listRows("services"), listRows("gallery_items")]); const trend = Array(7).fill(0); enquiries.forEach((item) => { const days = Math.floor((Date.now() - new Date(item.created_at)) / 86400000); if (days >= 0 && days < 7) trend[6 - days] += 1; }); setRecent(enquiries.slice(0, 5)); setStats({ newEnquiries: enquiries.filter((item) => item.status === "new").length, contactedEnquiries: enquiries.filter((item) => item.status === "contacted").length, convertedEnquiries: enquiries.filter((item) => normalizeEnquiryStatus(item.status) === "converted").length, projects: projects.filter((item) => item.is_published).length, services: services.filter((item) => item.is_published).length, gallery: gallery.length, trend }); })().catch((err) => console.error("[CMS] Dashboard refresh failed", err)); }, [refreshKey]);
  const refreshDashboard = () => setRefreshKey((key) => key + 1);
  const select = (key) => { setActive(key); setSidebar(false); };
  return <div className={`admin-shell theme-${theme}`}><aside className={sidebar ? "admin-sidebar open" : "admin-sidebar"}><div className="admin-logo"><img src="/images/solglow-mark.png" alt="" /><div><strong>Solglow</strong><small>Enterprise CMS</small></div><button onClick={() => setSidebar(false)}><X /></button></div><nav><button className={active === "dashboard" ? "active" : ""} onClick={() => select("dashboard")}><LayoutDashboard /> Dashboard</button><span>Content</span>{Object.entries(moduleConfig).map(([key, item]) => { const Icon = item.icon; return <button className={active === key ? "active" : ""} key={key} onClick={() => select(key)}><Icon /> {item.label}</button>; })}<span>Operations</span><button className={active === "media" ? "active" : ""} onClick={() => select("media")}><FileImage /> Media Manager</button><button className={active === "enquiries" ? "active" : ""} onClick={() => select("enquiries")}><MessageSquareQuote /> Enquiries</button></nav><div className="admin-user"><span>{session.user.email?.slice(0, 1).toUpperCase()}</span><div><strong>{session.user.email}</strong><small>Authenticated staff</small></div><button onClick={() => supabase.auth.signOut()} aria-label="Sign out"><LogOut /></button></div></aside><div className="admin-stage"><header className="admin-topbar"><button className="mobile-sidebar" onClick={() => setSidebar(true)}><Menu /></button><div><strong>{active === "dashboard" ? "Dashboard" : active === "enquiries" ? "Enquiries" : active === "media" ? "Media Manager" : moduleConfig[active]?.label}</strong><small>Solglow content operations</small></div><label className="top-search"><Search /><input placeholder="Search CMS" /></label><button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">{theme === "dark" ? <Sun /> : <Moon />}</button></header><main className="admin-content">{active === "dashboard" ? <Dashboard stats={stats} recent={recent} /> : active === "enquiries" ? <EnquiryManager onChanged={refreshDashboard} /> : active === "media" ? <MediaManager /> : <ModuleManager moduleKey={active} onChanged={refreshDashboard} />}</main></div></div>;
}

export default function AdminApp() {
  const [session, setSession] = useState(null); const [loading, setLoading] = useState(isSupabaseConfigured); const [recovery, setRecovery] = useState(false); const [role, setRole] = useState(null); const [roleChecked, setRoleChecked] = useState(!isSupabaseConfigured);
  useEffect(() => { if (!supabase) return; supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); }); const { data } = supabase.auth.onAuthStateChange((event, next) => { if (event === "PASSWORD_RECOVERY") setRecovery(true); setSession(next); setLoading(false); }); return () => data.subscription.unsubscribe(); }, []);
  useEffect(() => {
    if (!supabase || !session) { setRole(null); setRoleChecked(true); return; }
    let active = true;
    setRoleChecked(false);
    supabase.from("profiles").select("role").eq("id", session.user.id).single()
      .then(({ data }) => { if (active) setRole(data?.role || null); })
      .finally(() => { if (active) setRoleChecked(true); });
    return () => { active = false; };
  }, [session]);
  if (!isSupabaseConfigured) return <SetupScreen />;
  if (loading) return <div className="admin-loading"><LoaderCircle className="spin" /> Loading secure workspace</div>;
  if (!session || recovery) return <AuthScreen recovery={recovery} onRecoveryComplete={() => setRecovery(false)} />;
  if (!roleChecked) return <div className="admin-loading"><LoaderCircle className="spin" /> Verifying CMS permissions</div>;
  if (!["admin", "editor"].includes(role)) return <AccessDenied onSignOut={() => supabase.auth.signOut()} />;
  return <AdminShell session={session} />;
}
