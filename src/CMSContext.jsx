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

export function useDynamicServices(fallback) {
  const { content } = useCMS();
  if (!content.services?.length) return fallback;
  return content.services.map((row) => {
    const original = fallback.find((item) => item.path === `/${row.slug}` || item.path.endsWith(row.slug)) || {};
    return {
      ...original,
      path: `/${row.slug}`,
      nav: row.nav_label || row.title,
      icon: row.icon || original.icon || "SOL",
      title: row.title,
      eyebrow: row.eyebrow || original.eyebrow || "Solar solution",
      image: row.image_url || original.image || "/images/solglow-hero.png",
      summary: row.summary || original.summary || "Professional clean-energy solutions designed around your site.",
      lead: row.body || original.lead || row.summary,
      benefits: Array.isArray(row.benefits) && row.benefits.length ? row.benefits : original.benefits || [],
      applications: row.metadata?.applications || original.applications || [],
      metrics: row.metadata?.metrics || original.metrics || [["Smart", "energy planning"], ["Quality", "execution"], ["Long", "term value"]],
      processNote: row.metadata?.processNote || original.processNote || "Every recommendation follows site assessment, design, installation and dependable support.",
      cmsFaqs: Array.isArray(row.faqs) ? row.faqs : [],
      ctaLabel: row.cta_label || "Request a Callback",
      ctaUrl: row.cta_url || ""
    };
  });
}
