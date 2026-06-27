import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const contact = {
  company: "Solglow Power Solutions Pvt Ltd",
  address: "No.52/2321A, Pallathusseri Building, Adjacent to Hotel Broad Bean, Sahakarana Road, Vyttila Kochi, Kerala, India 682019",
  phone: "0484 2940532",
  mobile: "9847055764",
  email: "info@solglowpowers.com",
  website: "www.solglowpowers.com",
  director: "DR GOPAL SHANKAR"
};

const social = [
  ["Facebook", "f", "https://www.facebook.com/solglowpowers"],
  ["Instagram", "ig", "https://www.instagram.com/solglowpower"],
  ["YouTube", "yt", "https://www.youtube.com/channel/UCFusZ4dQhMJQFsH0nxsiLoQ"]
];

const pages = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/residential-solar", label: "Residential Solar" },
  { path: "/commercial-solar", label: "Commercial Solar" },
  { path: "/industrial-solar", label: "Industrial Solar" },
  { path: "/solar-water-heaters", label: "Solar Water Heaters" },
  { path: "/solar-street-lights", label: "Solar Street Lights" },
  { path: "/backup-solutions-batteries", label: "Backup & Batteries" },
  { path: "/projects-gallery", label: "Projects" },
  { path: "/why-solar", label: "Why Solar" },
  { path: "/contact", label: "Contact Us" }
];

const services = [
  {
    path: "/residential-solar",
    title: "Residential Solar Rooftop Solutions",
    short: "Premium rooftop solar for modern homes that want lower bills, cleaner power and dependable support.",
    image: "/images/project-residential.png",
    bullets: ["Home energy consultation", "Roof-ready system design", "Net-metering focused planning", "Low-maintenance long-term performance"]
  },
  {
    path: "/commercial-solar",
    title: "Commercial Solar Rooftop Solutions",
    short: "Solar systems for offices, showrooms, institutions and commercial spaces seeking predictable energy savings.",
    image: "/images/project-commercial.png",
    bullets: ["Consumption-led sizing", "Professional installation planning", "Premium products and components", "Lower operational energy costs"]
  },
  {
    path: "/industrial-solar",
    title: "Industrial Solar Rooftop Solutions",
    short: "Robust solar infrastructure for factories, warehouses and high-consumption industrial facilities.",
    image: "/images/solglow-hero.png",
    bullets: ["High-load energy planning", "Scalable solar architecture", "Reliable execution", "Support for long-term ROI"]
  },
  {
    path: "/solar-water-heaters",
    title: "Solar Water Heaters",
    short: "Efficient solar thermal systems that reduce water-heating costs for homes, apartments and businesses.",
    image: "/images/project-residential.png",
    bullets: ["Hot-water demand assessment", "Durable system options", "Energy-saving installation", "Practical low-maintenance operation"]
  },
  {
    path: "/solar-street-lights",
    title: "Solar Street Lights",
    short: "Smart outdoor solar lighting for campuses, roads, communities and commercial premises.",
    image: "/images/project-commercial.png",
    bullets: ["Outdoor lighting planning", "Clean independent power", "Reliable night-time performance", "Suitable for public and private spaces"]
  },
  {
    path: "/backup-solutions-batteries",
    title: "Backup Solutions & Batteries",
    short: "Backup power and battery solutions that improve resilience for homes and business-critical operations.",
    image: "/images/solglow-hero.png",
    bullets: ["Backup requirement analysis", "Battery selection guidance", "Solar-ready storage options", "Dependable support and maintenance"]
  }
];

const process = ["Consultation", "Site Survey", "System Design", "Installation", "Support & Maintenance"];
const why = ["Professional Solar Consultation", "Customized System Design", "Quality Products", "Reliable Installation", "Long-Term Support", "Energy Saving Focus"];
const benefits = ["Reduce electricity bills", "Clean renewable energy", "Low maintenance", "Long-term savings", "Better energy independence", "Eco-friendly future"];

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function Link({ to, children, className = "", onClick }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (to.startsWith("/")) {
          event.preventDefault();
          navigate(to);
        }
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function Preloader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${hidden ? "preloader--hidden" : ""}`}>
      <div className="loader-orbit">
        <img src="/images/solglow-mark.png" alt="" />
      </div>
      <strong>Powering a Brighter Tomorrow</strong>
    </div>
  );
}

function CursorGlow() {
  useEffect(() => {
    const cursor = document.querySelector(".cursor-glow");
    const dot = document.querySelector(".cursor-dot");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <><span className="cursor-glow" /><span className="cursor-dot" /></>;
}

function Magnetic({ children, className = "", onClick, type }) {
  const [style, setStyle] = useState({});
  return (
    <button
      type={type || "button"}
      className={`btn ${className}`}
      style={style}
      onClick={onClick}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setStyle({ transform: `translate(${(event.clientX - rect.left - rect.width / 2) * 0.12}px, ${(event.clientY - rect.top - rect.height / 2) * 0.18}px)` });
      }}
      onMouseLeave={() => setStyle({ transform: "translate(0, 0)" })}
    >
      {children}
    </button>
  );
}

function Header({ openPopup }) {
  const [open, setOpen] = useState(false);
  const current = window.location.pathname;
  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <img src="/images/solglow-mark.png" alt="Solglow logo" />
        <span><strong>Solglow</strong><small>Power Solutions Pvt Ltd</small></span>
      </Link>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button>
      <nav className={open ? "nav-links nav-links--open" : "nav-links"}>
        {pages.slice(0, 11).map((page) => <Link key={page.path} to={page.path} className={current === page.path ? "active" : ""} onClick={() => setOpen(false)}>{page.label}</Link>)}
      </nav>
      <Magnetic className="btn-primary nav-cta" onClick={openPopup}>Get Free Consultation</Magnetic>
    </header>
  );
}

function EnquiryForm({ compact = false }) {
  const [captcha] = useState(() => {
    const a = 7;
    const b = 4;
    return { question: `${a} + ${b} = ?`, answer: String(a + b) };
  });
  const [form, setForm] = useState({ name: "", mobile: "", email: "", service: "", message: "", captcha: "" });
  const [state, setState] = useState({ error: "", success: "" });

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  function submit(event) {
    event.preventDefault();
    if (form.captcha.trim() !== captcha.answer) {
      setState({ error: "Please solve the math captcha before submitting.", success: "" });
      return;
    }
    setState({ error: "", success: "Thank you. Solglow will contact you shortly." });
    setForm({ name: "", mobile: "", email: "", service: "", message: "", captcha: "" });
  }

  return (
    <form className={compact ? "lead-form lead-form--compact" : "lead-form"} onSubmit={submit}>
      <label>Name<input required value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
      <label>Mobile<input required inputMode="tel" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
      <label>Service Required<select required value={form.service} onChange={(e) => update("service", e.target.value)}>
        <option value="">Select a service</option>
        {services.map((service) => <option key={service.title}>{service.title}</option>)}
        <option>On-Grid Solar Power Plants</option>
        <option>Off-Grid Solar Power Plants</option>
      </select></label>
      <label className="wide">Message<textarea rows={compact ? 3 : 4} required value={form.message} onChange={(e) => update("message", e.target.value)} /></label>
      <label>{captcha.question}<input required inputMode="numeric" value={form.captcha} onChange={(e) => update("captcha", e.target.value)} /></label>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-success">{state.success}</p>}
      <Magnetic className="btn-primary wide" type="submit">Submit Enquiry</Magnetic>
    </form>
  );
}

function Popup({ visible, close }) {
  if (!visible) return null;
  return (
    <div className="popup-backdrop" role="dialog" aria-modal="true">
      <div className="popup-card">
        <button className="close-btn" onClick={close} aria-label="Close enquiry form">×</button>
        <span className="eyebrow">Priority Solar Consultation</span>
        <h2>Start your solar savings plan today.</h2>
        <p>Share your requirement and Solglow will help you choose the right rooftop, power plant or backup solution.</p>
        <EnquiryForm compact />
      </div>
    </div>
  );
}

function Hero({ eyebrow, title, text, image = "/images/solglow-hero.png", children }) {
  return (
    <section className="page-hero reveal is-visible">
      <img className="hero-img" src={image} alt="" />
      <div className="hero-layer" />
      <div className="solar-grid" />
      <div className="hero-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
    </section>
  );
}

function Section({ eyebrow, title, children, className = "" }) {
  return (
    <section className={`section reveal ${className}`}>
      <div className="section-heading">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2>{title}</h2>}
      </div>
      {children}
    </section>
  );
}

function Counter({ value, label }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1300, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <article className="stat-card"><strong>{count}+</strong><span>{label}</span></article>;
}

function CTA({ openPopup }) {
  return (
    <section className="cta reveal">
      <span className="eyebrow">Free Consultation</span>
      <h2>Ready to reduce your power bills with solar?</h2>
      <p>Talk to Solglow about your site, consumption and the right solar or backup solution for your needs.</p>
      <Magnetic className="btn-primary" onClick={openPopup}>Request a Callback</Magnetic>
    </section>
  );
}

function Home({ openPopup }) {
  return (
    <>
      <Hero
        eyebrow="Kerala-based premium solar energy partner"
        title="Switch to Smarter, Cleaner & Reliable Solar Energy"
        text="Premium solar rooftop, power plant and backup solutions for residential, commercial and industrial needs."
      >
        <div className="hero-actions">
          <Magnetic className="btn-primary" onClick={openPopup}>Get Free Consultation</Magnetic>
          <Link className="btn btn-ghost" to="/residential-solar">Explore Solutions</Link>
        </div>
      </Hero>
      <section className="floating-stats reveal is-visible">
        <Counter value={250} label="Solar conversations guided" />
        <Counter value={9} label="Solution categories" />
        <Counter value={24} label="Support-focused planning" />
        <Counter value={100} label="Energy-saving mindset" />
      </section>
      <Section eyebrow="Solglow Advantage" title="A cleaner energy partner built for homes, businesses and industries.">
        <div className="split premium-panel">
          <div>
            <p className="lead">Solglow Power Solutions Pvt Ltd helps customers in Kochi and across Kerala reduce energy costs and move toward sustainable, reliable power.</p>
            <p>Every project starts with the customer’s power requirement, site condition and long-term savings goal. The result is a solar experience that feels professional, transparent and dependable.</p>
          </div>
          <div className="signature-card">
            <img src="/images/solglow-mark.png" alt="" />
            <strong>Premium solar solutions, professionally delivered.</strong>
          </div>
        </div>
      </Section>
      <ServicePreview />
      <WhyCards />
      <Process />
      <GalleryPreview />
      <CTA openPopup={openPopup} />
    </>
  );
}

function ServicePreview() {
  return (
    <Section eyebrow="Solutions" title="Complete renewable energy solutions under one trusted brand.">
      <div className="card-grid">
        {services.map((service, index) => (
          <Link className="service-card" key={service.path} to={service.path}>
            <Icon>{["☀", "▦", "⚡", "◉", "✦", "▣"][index]}</Icon>
            <h3>{service.title}</h3>
            <p>{service.short}</p>
            <span>View solution →</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function WhyCards() {
  return (
    <Section eyebrow="Why Choose Solglow" title="Premium execution details that create confidence.">
      <div className="mini-grid">
        {why.map((item) => <article className="mini-card" key={item}><Icon>✺</Icon><h3>{item}</h3></article>)}
      </div>
    </Section>
  );
}

function Process() {
  return (
    <Section eyebrow="Process" title="A clear, professional path from enquiry to support.">
      <div className="process">
        {process.map((step, index) => <article className="process-step" key={step}><span>{index + 1}</span><h3>{step}</h3></article>)}
      </div>
    </Section>
  );
}

function GalleryPreview() {
  return (
    <Section eyebrow="Projects / Gallery" title="Premium project visuals, ready to replace with real Solglow installations.">
      <div className="project-grid">
        {[
          ["/images/project-residential.png", "Residential Rooftop Installations"],
          ["/images/solglow-hero.png", "Premium Solar Rooftop Systems"],
          ["/images/project-commercial.png", "Commercial & Industrial Solar Arrays"]
        ].map(([src, title]) => <article className="project-card" key={title}><img src={src} alt={title} /><div><span>Replaceable image</span><h3>{title}</h3></div></article>)}
      </div>
    </Section>
  );
}

function About({ openPopup }) {
  return (
    <>
      <Hero eyebrow="About Solglow" title="A trusted Kerala solar company with a premium, service-first mindset." text="Solglow Power Solutions Pvt Ltd is based in Kochi, Kerala, helping homes, businesses and industries move toward reliable sustainable power." />
      <Section eyebrow="Who We Are" title="Solar solutions designed around savings, reliability and long-term support.">
        <div className="split">
          <p className="lead">Solglow delivers residential, commercial and industrial solar rooftop solutions, on-grid and off-grid power plants, solar water heaters, solar street lights, backup solutions and batteries.</p>
          <div className="glass-list">{why.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </Section>
      <CTA openPopup={openPopup} />
    </>
  );
}

function ServicePage({ service, openPopup }) {
  return (
    <>
      <Hero eyebrow="Solglow Solution" title={service.title} text={service.short} image={service.image}>
        <div className="hero-actions"><Magnetic className="btn-primary" onClick={openPopup}>Get Free Consultation</Magnetic><Link className="btn btn-ghost" to="/contact">Talk to Solglow</Link></div>
      </Hero>
      <Section eyebrow="What You Get" title="Premium planning, clean execution and long-term support.">
        <div className="split">
          <div>
            <p className="lead">{service.short}</p>
            <p>Solglow focuses on practical consultation, customized system design, quality products, dependable installation and support that helps customers make a confident solar decision.</p>
          </div>
          <div className="glass-list">{service.bullets.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </Section>
      <Process />
      <CTA openPopup={openPopup} />
    </>
  );
}

function WhySolar({ openPopup }) {
  return (
    <>
      <Hero eyebrow="Why Solar" title="Solar is a smarter long-term energy decision." text="Reduce bills, improve energy independence and support a cleaner future with professionally planned renewable power." />
      <Section eyebrow="Benefits" title="A premium solar investment should be simple to understand.">
        <div className="benefit-wrap">{benefits.map((item) => <article className="benefit" key={item}><span />{item}</article>)}</div>
      </Section>
      <CTA openPopup={openPopup} />
    </>
  );
}

function Projects({ openPopup }) {
  return (
    <>
      <Hero eyebrow="Projects / Gallery" title="A polished portfolio space for Solglow’s real project images." text="The current images are premium solar placeholders and can be replaced with real residential, commercial and industrial installations." />
      <GalleryPreview />
      <CTA openPopup={openPopup} />
    </>
  );
}

function ContactPage({ openPopup }) {
  return (
    <>
      <Hero eyebrow="Contact Us" title="Talk to Solglow about your solar project." text="Get a professional consultation for rooftop solar, solar power plants, water heaters, street lights, backup solutions or batteries." />
      <Section eyebrow="Enquiry" title="Share your requirement and get a callback.">
        <div className="contact-layout">
          <ContactCard />
          <EnquiryForm />
        </div>
      </Section>
      <CTA openPopup={openPopup} />
    </>
  );
}

function ContactCard() {
  return (
    <article className="contact-card">
      <img src="/images/solglow-mark.png" alt="" />
      <h3>{contact.company}</h3>
      <p><strong>Corp Off:</strong> {contact.address}</p>
      <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>Phone: {contact.phone}</a>
      <a href={`tel:+91${contact.mobile}`}>Mobile: {contact.mobile}</a>
      <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
      <a href="https://www.solglowpowers.com">Website: {contact.website}</a>
      <div className="director"><strong>{contact.director}</strong><span>Director</span><a href={`tel:+91${contact.mobile}`}>Mobile: {contact.mobile}</a></div>
      <div className="socials">{social.map(([name, icon, url]) => <a key={name} href={url} aria-label={name}>{icon}</a>)}</div>
    </article>
  );
}

function Footer({ openPopup }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/images/solglow-mark.png" alt="Solglow logo" />
        <strong>Solglow Power Solutions Pvt Ltd</strong>
        <p>Premium renewable energy solutions for residential, commercial and industrial customers.</p>
        <Magnetic className="btn-primary" onClick={openPopup}>WhatsApp / Enquire</Magnetic>
      </div>
      <div><h3>Quick Links</h3>{pages.slice(0, 11).map((page) => <Link key={page.path} to={page.path}>{page.label}</Link>)}</div>
      <div><h3>Services</h3>{services.map((service) => <Link key={service.path} to={service.path}>{service.title}</Link>)}<span>On-Grid Solar Power Plants</span><span>Off-Grid Solar Power Plants</span></div>
      <div><h3>Contact</h3><p>{contact.address}</p><a href={`tel:+91${contact.mobile}`}>{contact.mobile}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><div className="socials">{social.map(([name, icon, url]) => <a key={name} href={url}>{icon}</a>)}</div></div>
      <div className="developer-credit">
        <span>© 2026 Solglow Power Solutions Pvt Ltd. All rights reserved.</span>
        <span>Designed and Developed by <a href="https://growwithclickmyze.com/">Clickmyze</a></span>
        <span>Want a website like this? <a href="https://wa.me/919993013936">Contact Developer: +91 9993013936 (WA)</a></span>
      </div>
    </footer>
  );
}

function Router({ openPopup }) {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    document.body.classList.add("page-enter");
    const timer = setTimeout(() => document.body.classList.remove("page-enter"), 520);
    return () => clearTimeout(timer);
  }, [path]);

  useEffect(() => {
    const routeLabel = pages.find((page) => page.path === path)?.label || services.find((service) => service.path === path)?.title || "Home";
    document.title = `${routeLabel} | Solglow Power Solutions Pvt Ltd`;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", `${routeLabel} by Solglow Power Solutions Pvt Ltd, Kochi, Kerala. Premium solar rooftop, power plant and backup solutions for homes, businesses and industries.`);
    }
  }, [path]);

  if (path === "/") return <Home openPopup={openPopup} />;
  if (path === "/about") return <About openPopup={openPopup} />;
  if (path === "/projects-gallery") return <Projects openPopup={openPopup} />;
  if (path === "/why-solar") return <WhySolar openPopup={openPopup} />;
  if (path === "/contact") return <ContactPage openPopup={openPopup} />;
  const service = services.find((item) => item.path === path);
  return service ? <ServicePage service={service} openPopup={openPopup} /> : <Home openPopup={openPopup} />;
}

function App() {
  const [popup, setPopup] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.14 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
  useEffect(() => {
    const onScroll = () => document.documentElement.style.setProperty("--scroll", String(window.scrollY * 0.08));
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPopup = () => setPopup(true);
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Header openPopup={openPopup} />
      <main><Router openPopup={openPopup} /></main>
      <Footer openPopup={openPopup} />
      <Popup visible={popup} close={() => setPopup(false)} />
      <a className="whatsapp" href="https://wa.me/919847055764" aria-label="Chat on WhatsApp">WA</a>
      <a className="mobile-call" href="tel:+919847055764">Call Now</a>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
