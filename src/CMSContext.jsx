import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getPublishedContent } from "./lib/cms";
import { isSupabaseConfigured } from "./lib/supabase";

const CMSContext = createContext({ content: {}, loading: false, configured: false });

export function CMSProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(isSupabaseConfigured);
  useEffect(() => {
    let active = true;
    getPublishedContent().then((next) => active && setContent(next)).catch(() => {}).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);
  const value = useMemo(() => ({ content, loading, configured: isSupabaseConfigured }), [content, loading]);
  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export const useCMS = () => useContext(CMSContext);

const hasText = (value) => typeof value === "string" ? value.trim().length > 0 : value != null;

export function useDynamicServices(fallback) {
  const { content } = useCMS();
  const rows = (content.services || []).filter((row) => hasText(row.slug) && hasText(row.title));
  if (!rows.length) return fallback;

  const byPath = new Map(fallback.map((service) => [service.path, service]));
  for (const row of rows) {
    const path = `/${String(row.slug).replace(/^\/+/, "")}`;
    const original = byPath.get(path) || fallback.find((item) => item.path.endsWith(row.slug)) || {};
    byPath.set(path, {
      ...original,
      path,
      nav: row.nav_label || row.title || original.nav,
      icon: row.icon || original.icon || "SOL",
      title: row.title || original.title,
      eyebrow: row.eyebrow || original.eyebrow || "Solar solution",
      image: row.image_url || original.image || "/images/solglow-hero.png",
      summary: row.summary || original.summary || "Professional clean-energy solutions designed around your site.",
      lead: row.body || original.lead || row.summary || original.summary,
      benefits: Array.isArray(row.benefits) && row.benefits.length ? row.benefits : original.benefits || [],
      applications: row.metadata?.applications || original.applications || [],
      metrics: row.metadata?.metrics || original.metrics || [["Smart", "energy planning"], ["Quality", "execution"], ["Long", "term value"]],
      processNote: row.metadata?.processNote || original.processNote || "Every recommendation follows site assessment, design, installation and dependable support.",
      cmsFaqs: Array.isArray(row.faqs) ? row.faqs : [],
      ctaLabel: row.cta_label || "Request a Callback",
      ctaUrl: row.cta_url || ""
    });
  }

  const fallbackPaths = new Set(fallback.map((service) => service.path));
  const mergedFallback = fallback.map((service) => byPath.get(service.path) || service);
  const additionalServices = [...byPath.entries()].filter(([path]) => !fallbackPaths.has(path)).map(([, service]) => service);
  return [...mergedFallback, ...additionalServices];
}
