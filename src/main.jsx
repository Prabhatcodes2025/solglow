import React, { useEffect, useState } from "react";
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
  ["Facebook", "facebook", "https://www.facebook.com/solglowpowers"],
  ["Instagram", "instagram", "https://www.instagram.com/solglowpower"],
  ["YouTube", "youtube", "https://www.youtube.com/channel/UCFusZ4dQhMJQFsH0nxsiLoQ"]
];

const serviceData = [
  {
    path: "/residential-solar",
    nav: "Residential Solar",
    icon: "SUN",
    title: "Residential Solar Rooftop Solutions",
    eyebrow: "Solar for premium homes",
    image: "/images/project-residential.png",
    summary: "Elegant rooftop solar systems for families who want lower monthly power bills, cleaner energy and dependable support from consultation to maintenance.",
    lead: "Solglow designs residential solar around your roof, power usage and savings goal. The result is a clean, durable and low-maintenance solar system that blends with modern homes while delivering practical long-term value.",
    metrics: [["Lower", "monthly bills"], ["Clean", "renewable power"], ["Smart", "roof planning"]],
    benefits: ["Customized rooftop sizing", "Net-metering focused guidance", "Premium panels and components", "Clean cable routing and installation", "Support for long-term performance", "Ideal for independent homes and villas"],
    applications: ["Independent homes", "Villas", "Apartments common loads", "Home offices"],
    processNote: "We assess roof direction, shadow patterns, daily consumption and future load growth before recommending the right residential solar configuration."
  },
  {
    path: "/commercial-solar",
    nav: "Commercial Solar",
    icon: "COM",
    title: "Commercial Solar Rooftop Solutions",
    eyebrow: "Solar for business spaces",
    image: "/images/project-commercial.png",
    summary: "Conversion-focused commercial solar for offices, showrooms, institutions and retail spaces that need measurable energy savings and a professional installation experience.",
    lead: "Commercial energy costs directly affect operating margins. Solglow helps businesses use idle rooftop space to generate clean power, reduce grid dependency and create a stronger sustainability profile.",
    metrics: [["Better", "operating savings"], ["Smart", "load planning"], ["Clean", "brand impact"]],
    benefits: ["Consumption-based system design", "Rooftop utilization planning", "Professional installation workflow", "Scalable system architecture", "Reliable post-installation support", "Ideal for retail and office energy loads"],
    applications: ["Offices", "Showrooms", "Schools and institutions", "Hospitality and retail"],
    processNote: "We align system capacity with business hours, sanctioned load, billing pattern and long-term expansion needs."
  },
  {
    path: "/industrial-solar",
    nav: "Industrial Solar",
    icon: "IND",
    title: "Industrial Solar Rooftop Solutions",
    eyebrow: "Solar for heavy energy users",
    image: "/images/solglow-hero.png",
    summary: "Robust solar infrastructure for factories, warehouses and industrial facilities where uptime, safety, scalability and long-term energy economics matter.",
    lead: "Industrial solar requires disciplined planning. Solglow approaches every project with attention to roof structure, consumption profile, safety, installation sequencing and long-term return.",
    metrics: [["High", "load planning"], ["Robust", "execution"], ["Long", "term ROI"]],
    benefits: ["High-consumption energy analysis", "Factory and warehouse rooftop planning", "Scalable solar plant architecture", "Quality product selection", "Installation coordination", "Performance and maintenance focus"],
    applications: ["Factories", "Warehouses", "Manufacturing units", "Industrial campuses"],
    processNote: "We map peak loads, roof zones, access paths and safety requirements so the system is practical for industrial environments."
  },
  {
    path: "/on-grid-solar-plants",
    nav: "On-Grid Plants",
    icon: "GRID",
    title: "On-Grid Solar Power Plants",
    eyebrow: "Grid-connected performance",
    image: "/images/service-on-grid.png",
    summary: "Grid-connected solar power plants planned for reliable generation, efficient energy offset and a professional path toward lower electricity costs.",
    lead: "On-grid solar is ideal when customers want to reduce grid electricity usage while staying connected to the utility network. Solglow helps plan system size, components and execution with a performance-first mindset.",
    metrics: [["Grid", "connected"], ["Smart", "energy offset"], ["ROI", "focused"]],
    benefits: ["Grid-tied solar planning", "Inverter and component guidance", "Energy offset strategy", "Suitable for homes and businesses", "Premium installation approach", "Support for long-term generation"],
    applications: ["Homes with grid access", "Commercial rooftops", "Institutions", "Industrial buildings"],
    processNote: "We review consumption, roof area, grid connection and expected generation so the plant is sized with financial practicality."
  },
  {
    path: "/off-grid-solar-plants",
    nav: "Off-Grid Plants",
    icon: "OFF",
    title: "Off-Grid Solar Power Plants",
    eyebrow: "Independent energy systems",
    image: "/images/service-off-grid.png",
    summary: "Independent solar power systems with storage support for locations that need reliable energy beyond conventional grid dependency.",
    lead: "Off-grid solar is about resilience. Solglow plans solar generation, battery backup and power conditioning around the real usage pattern of remote homes, facilities and special applications.",
    metrics: [["Energy", "independence"], ["Storage", "ready"], ["Resilient", "power"]],
    benefits: ["Solar plus storage planning", "Remote-site suitability", "Backup autonomy guidance", "Battery and inverter coordination", "Reliable system architecture", "Support for critical loads"],
    applications: ["Remote homes", "Farms", "Facilities with unreliable grid", "Special power applications"],
    processNote: "We identify critical loads, backup hours, battery requirements and available solar exposure before proposing an off-grid system."
  },
  {
    path: "/solar-water-heaters",
    nav: "Water Heaters",
    icon: "HOT",
    title: "Solar Water Heaters",
    eyebrow: "Solar thermal efficiency",
    image: "/images/service-water-heater.png",
    summary: "Efficient solar water heating systems for homes, apartments and businesses that want to reduce energy used for daily hot-water demand.",
    lead: "Solar water heaters are practical, proven and energy-saving. Solglow helps customers select the right capacity and installation approach based on usage, roof placement and durability expectations.",
    metrics: [["Lower", "heating cost"], ["Daily", "hot water"], ["Low", "maintenance"]],
    benefits: ["Hot-water demand assessment", "Capacity selection support", "Durable system options", "Clean rooftop installation", "Energy-saving operation", "Suitable for homes and hospitality"],
    applications: ["Homes", "Apartments", "Hotels", "Hostels and institutions"],
    processNote: "We calculate hot-water demand, roof placement and usage pattern so the heater capacity is practical and efficient."
  },
  {
    path: "/solar-street-lights",
    nav: "Street Lights",
    icon: "LUX",
    title: "Solar Street Lights",
    eyebrow: "Clean outdoor lighting",
    image: "/images/service-street-lights.png",
    summary: "Smart solar street lighting for campuses, roads, communities and commercial spaces that need reliable night lighting with clean energy.",
    lead: "Solar street lights improve safety and visibility without heavy cabling dependency. Solglow plans pole placement, illumination coverage and product selection for dependable outdoor use.",
    metrics: [["Smart", "outdoor light"], ["Solar", "powered"], ["Safe", "campuses"]],
    benefits: ["Lighting layout planning", "Pole and fixture guidance", "Independent solar operation", "Suitable for roads and campuses", "Reliable night-time illumination", "Low operating cost"],
    applications: ["Private roads", "Campuses", "Residential communities", "Commercial premises"],
    processNote: "We review site length, illumination needs, pole spacing and battery autonomy to build a reliable lighting plan."
  },
  {
    path: "/backup-solutions-batteries",
    nav: "Backup & Batteries",
    icon: "BAT",
    title: "Backup Solutions & Batteries",
    eyebrow: "Reliable power continuity",
    image: "/images/service-off-grid.png",
    summary: "Backup systems and batteries designed to improve energy resilience for homes, offices and business-critical loads.",
    lead: "A backup system should match real usage, not guesswork. Solglow helps identify critical loads, backup duration, battery type and solar-ready options for dependable continuity.",
    metrics: [["Power", "continuity"], ["Battery", "planning"], ["Critical", "loads"]],
    benefits: ["Critical-load assessment", "Battery selection guidance", "Solar-ready storage planning", "Inverter and backup coordination", "Dependable installation approach", "Support and maintenance focus"],
    applications: ["Homes", "Offices", "Small businesses", "Critical backup needs"],
    processNote: "We define what must stay powered, for how long, and how the backup system should integrate with solar or grid supply."
  }
];

const pages = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/projects-gallery", label: "Projects" },
  { path: "/why-solar", label: "Why Solar" },
  { path: "/contact", label: "Contact Us" }
];

const process = ["Consultation", "Site Survey", "System Design", "Installation", "Support & Maintenance"];
const why = ["Professional Solar Consultation", "Customized System Design", "Quality Products", "Reliable Installation", "Long-Term Support", "Energy Saving Focus"];
const benefits = ["Reduce electricity bills", "Clean renewable energy", "Low maintenance", "Long-term savings", "Better energy independence", "Eco-friendly future"];
const proofStats = [["25+", "Team members"], ["180 kW", "IOCL Parippalli solar project"], ["800+", "Projects delivered"], ["3", "Kerala branch regions"]];

const pageFaqs = {
  home: [
    ["What does Solglow help with?", "Solglow supports rooftop solar, on-grid and off-grid plants, solar water heaters, street lights, backup systems and batteries for homes, businesses and industries."],
    ["How does a consultation begin?", "The team reviews your location, usage pattern, roof or site condition and savings goal before suggesting a practical clean-energy path."],
    ["Does Solglow provide support after installation?", "Yes. The brand position is built around consultation, design, installation and long-term support."]
  ],
  about: [
    ["Where is Solglow based?", "Solglow Power Solutions Pvt Ltd operates from Kochi with service presence across Kerala, including Trivandrum, Thrissur and Kozhikode regions."],
    ["What makes Solglow different?", "The company combines practical engineering, quality installation, operations and maintenance support, and a premium customer experience."],
    ["Does Solglow handle large projects?", "Yes. The reference portfolio includes landmark work such as a 180 kW solar project at IOCL Parippalli."]
  ],
  projects: [
    ["Can real project photos be added later?", "Yes. The current premium gallery is structured so verified residential, commercial and industrial project photos can be added without changing the design system."],
    ["What project details should be shown?", "Capacity, location type, category, installation context and customer goal are the most useful details for future case studies."],
    ["Which categories matter most?", "Residential rooftops, commercial buildings, industrial rooftops, on-grid plants, off-grid systems, water heating and street lighting."]
  ],
  whySolar: [
    ["Is solar only for high electricity users?", "No. Solar can support homes, shops, offices, institutions and industrial users when the system is sized around actual consumption."],
    ["Is maintenance difficult?", "Quality solar systems are generally low maintenance, especially when installed with clean access, correct components and periodic support."],
    ["Can solar work with backup?", "Yes. Solar can be planned with inverter and battery strategies where energy continuity is important."]
  ],
  contact: [
    ["What should I share before a callback?", "Share your location, approximate electricity bill, roof or site type, preferred service and whether savings or backup is the priority."],
    ["Can I contact through WhatsApp?", "Yes. The WhatsApp CTA connects directly to Solglow at +91 9847055764."],
    ["Does the enquiry form have captcha validation?", "Yes. The form uses a random math captcha that refreshes after submission and whenever the popup opens."]
  ]
};

function Icon({ name }) {
  const icons = {
    facebook: <path d="M18 2h-4a7 7 0 0 0-7 7v4H3v6h4v13h6V19h5l1-6h-6V9a1 1 0 0 1 1-1h4V2Z" />,
    instagram: <><rect x="4" y="4" width="24" height="24" rx="7" /><circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="23" cy="9" r="1.6" /></>,
    youtube: <><path d="M29 10.5a4 4 0 0 0-2.8-2.8C23.7 7 16 7 16 7s-7.7 0-10.2.7A4 4 0 0 0 3 10.5 41 41 0 0 0 2.3 16 41 41 0 0 0 3 21.5a4 4 0 0 0 2.8 2.8C8.3 25 16 25 16 25s7.7 0 10.2-.7a4 4 0 0 0 2.8-2.8 41 41 0 0 0 .7-5.5 41 41 0 0 0-.7-5.5Z" /><path d="m13 20 8-4-8-4v8Z" fill="#07111d" /></>,
    whatsapp: <path d="M16 3C9.4 3 4 8.2 4 14.7c0 2.2.6 4.2 1.7 6L4 29l8.5-1.7c1.1.3 2.3.5 3.5.5 6.6 0 12-5.2 12-11.7S22.6 3 16 3Zm6.8 17c-.3.8-1.7 1.5-2.4 1.6-.6.1-1.4.2-4.6-1.1-3.9-1.6-6.4-5.4-6.6-5.7-.2-.2-1.6-2.1-1.6-4 0-1.9 1-2.8 1.4-3.2.3-.4.8-.5 1.1-.5h.8c.3 0 .6 0 .9.7.3.8 1.1 2.7 1.2 2.9.1.2.1.5 0 .8-.2.3-.3.5-.6.8-.2.2-.5.5-.2 1 .3.5 1.2 2 2.6 3.2 1.8 1.6 3.3 2.1 3.8 2.3.5.2.8.2 1.1-.1.3-.4 1.2-1.4 1.5-1.8.3-.5.7-.4 1.1-.2.4.1 2.7 1.3 3.2 1.5.5.2.8.4.9.6.1.1.1.8-.2 1.6Z" />,
    menu: <><span /><span /><span /></>
  };
  if (name === "menu") return <span className="hamburger" aria-hidden="true">{icons.menu}</span>;
  return <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">{icons[name]}</svg>;
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 9) + 1;
  return { question: `${a} + ${b} = ?`, answer: String(a + b) };
}

function useRevealClass(extraClass = "") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const frame = requestAnimationFrame(() => setVisible(true));
    const fallback = setTimeout(() => setVisible(true), 180);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [extraClass]);
  return `reveal ${visible ? "is-visible" : ""} ${extraClass}`.trim();
}

function navigate(path) {
  window.scrollTo({ top: 0, behavior: "auto" });
  window.history.pushState({}, "", path);
  window.dispatchEvent(new Event("popstate"));
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
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

function Preloader() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1600);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`preloader ${hidden ? "preloader--hidden" : ""}`}>
      <div className="loader-orbit"><img src="/images/solglow-mark.png" alt="" /></div>
      <strong>Powering a Brighter Tomorrow</strong>
    </div>
  );
}

function CursorGlow() {
  useEffect(() => {
    const glow = document.querySelector(".cursor-glow");
    const dot = document.querySelector(".cursor-dot");
    const trail = document.querySelector(".cursor-trail");
    const move = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      glow.style.transform = `translate(${x - 170}px, ${y - 170}px)`;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      trail.animate(
        [{ transform: `translate(${x - 14}px, ${y - 14}px) scale(0.5)`, opacity: 0.7 }, { transform: `translate(${x - 14}px, ${y - 14}px) scale(1.8)`, opacity: 0 }],
        { duration: 650, easing: "ease-out" }
      );
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <><span className="cursor-glow" /><span className="cursor-dot" /><span className="cursor-trail" /></>;
}

function Magnetic({ children, className = "", onClick, type = "button" }) {
  const [style, setStyle] = useState({});
  return (
    <button
      type={type}
      className={`btn ${className}`}
      style={style}
      onClick={onClick}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setStyle({ transform: `translate(${(event.clientX - rect.left - rect.width / 2) * 0.11}px, ${(event.clientY - rect.top - rect.height / 2) * 0.16}px)` });
      }}
      onMouseLeave={() => setStyle({ transform: "translate(0, 0)" })}
    >
      {children}
    </button>
  );
}

function Header({ openPopup }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    if (!open) setServicesOpen(false);
  }, [open]);
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  const closeNav = () => {
    setOpen(false);
    setServicesOpen(false);
  };
  const serviceActive = serviceData.some((service) => service.path === path);
  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeNav}>
        <img src="/images/solglow-mark.png" alt="Solglow logo" />
        <span><strong>Solglow</strong><small>Power Solutions Pvt Ltd</small></span>
      </Link>
      <button className={`menu-btn ${open ? "menu-btn--open" : ""}`} onClick={() => setOpen((current) => !current)} aria-label="Toggle navigation" aria-expanded={open}>
        <Icon name="menu" />
      </button>
      <nav className={open ? "nav-links nav-links--open" : "nav-links"} aria-label="Primary navigation">
        <Link to="/" className={path === "/" ? "active" : ""} onClick={closeNav}>Home</Link>
        <Link to="/about" className={path === "/about" ? "active" : ""} onClick={closeNav}>About Us</Link>
        <div className={`nav-service ${servicesOpen ? "nav-service--open" : ""}`}>
          <button type="button" className={serviceActive ? "service-trigger active" : "service-trigger"} onClick={() => setServicesOpen((current) => !current)} aria-expanded={servicesOpen} aria-controls="services-menu">
            Services <span>▾</span>
          </button>
          <div className="service-menu" id="services-menu">
            {serviceData.map((service) => <Link key={service.path} to={service.path} className={path === service.path ? "active" : ""} onClick={closeNav}>{service.nav}</Link>)}
          </div>
        </div>
        <Link to="/projects-gallery" className={path === "/projects-gallery" ? "active" : ""} onClick={closeNav}>Projects</Link>
        <Link to="/why-solar" className={path === "/why-solar" ? "active" : ""} onClick={closeNav}>Why Solar</Link>
        <Link to="/contact" className={path === "/contact" ? "active" : ""} onClick={closeNav}>Contact Us</Link>
      </nav>
      <Magnetic className="btn-primary nav-cta" onClick={openPopup}>Get Free Consultation</Magnetic>
    </header>
  );
}

function EnquiryForm({ compact = false }) {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "", captcha: "" });
  const [state, setState] = useState({ error: "", success: "" });
  const update = (key, value) => setForm({ ...form, [key]: value });
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setForm((current) => ({ ...current, captcha: "" }));
  };
  function submit(event) {
    event.preventDefault();
    if (form.captcha.trim() !== captcha.answer) {
      setState({ error: "Please solve the math captcha before submitting.", success: "" });
      refreshCaptcha();
      return;
    }
    setState({ error: "", success: "Thank you. Solglow will contact you shortly." });
    setForm({ name: "", phone: "", email: "", service: "", message: "", captcha: "" });
    setCaptcha(generateCaptcha());
  }
  return (
    <form className={compact ? "lead-form lead-form--compact" : "lead-form"} onSubmit={submit}>
      <label>Name<input required value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
      <label>Phone<input required inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label>
      <label>Email<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
      <label>Service Required<select required value={form.service} onChange={(e) => update("service", e.target.value)}>
        <option value="">Select a service</option>
        {serviceData.map((service) => <option key={service.title}>{service.title}</option>)}
      </select></label>
      <label className="wide">Message<textarea rows={compact ? 3 : 4} required value={form.message} onChange={(e) => update("message", e.target.value)} /></label>
      <label className="captcha-field"><span>{captcha.question}</span><input required inputMode="numeric" value={form.captcha} onChange={(e) => update("captcha", e.target.value)} /></label>
      <button className="captcha-refresh" type="button" onClick={refreshCaptcha}>Refresh Captcha</button>
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
        <button className="close-btn" onClick={close} aria-label="Close enquiry form">x</button>
        <div className="popup-media">
          <img src="/images/solglow-mark.png" alt="" />
          <span>Priority Solar Desk</span>
        </div>
        <div>
          <span className="eyebrow">Premium enquiry</span>
          <h2>Start your solar savings plan today.</h2>
          <p>Share your requirement and Solglow will help you choose the right rooftop, power plant, water heater, street light or backup solution.</p>
          <EnquiryForm compact />
        </div>
      </div>
    </div>
  );
}

function Hero({ eyebrow, title, text, image = "/images/solglow-hero.png", children, variant = "home" }) {
  const revealClass = useRevealClass(`page-hero page-hero--${variant}`);
  return (
    <section className={revealClass}>
      <img className="hero-img" src={image} alt="" />
      <div className="hero-layer" />
      <div className="ray ray-one" />
      <div className="ray ray-two" />
      <div className="solar-grid" />
      <div className="particles" />
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
  const revealClass = useRevealClass(`section ${className}`);
  return (
    <section className={revealClass}>
      <div className="section-heading">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2>{title}</h2>}
      </div>
      {children}
    </section>
  );
}

function Counter({ value, label, suffix = "+" }) {
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
  return <article className="stat-card tilt"><strong>{count}{suffix}</strong><span>{label}</span></article>;
}

function CTA({ openPopup, title = "Ready to reduce your power bills with solar?", text = "Talk to Solglow about your site, consumption and the right solar or backup solution for your needs." }) {
  const revealClass = useRevealClass("cta");
  return (
    <section className={revealClass}>
      <span className="eyebrow">Free consultation</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="cta-actions">
        <Magnetic className="btn-primary" onClick={openPopup}>Request a Callback</Magnetic>
        <a className="btn btn-ghost" href="https://wa.me/919847055764">WhatsApp Solglow</a>
      </div>
    </section>
  );
}

function Home({ openPopup }) {
  return (
    <>
      <Hero
        eyebrow="Premium solar energy company in Kochi, Kerala"
        title="Powering Homes, Businesses & Industries with Smarter Solar Energy"
        text="Premium rooftop solar, solar plants, backup solutions, solar water heaters and clean energy systems designed for long-term performance."
      >
        <div className="hero-actions">
          <Magnetic className="btn-primary" onClick={openPopup}>Get Free Consultation</Magnetic>
          <Link className="btn btn-ghost" to="/residential-solar">Explore Solutions</Link>
        </div>
      </Hero>
      <section className="floating-stats reveal is-visible">
        <Counter value={13} label="Premium service routes" />
        <Counter value={24} label="Support mindset" suffix="/7" />
        <Counter value={3} label="Customer segments" />
        <Counter value={100} label="Clean energy focus" />
      </section>
      <Section eyebrow="Brand promise" title="A solar partner that feels professional before, during and after installation.">
        <div className="agency-panel">
          <div>
            <p className="lead">Solglow Power Solutions Pvt Ltd helps residential, commercial and industrial customers move from high electricity costs to clean, reliable and intelligently planned solar power.</p>
            <p>Every recommendation is shaped by site conditions, consumption pattern, customer goals and support expectations. The experience is built to feel premium, transparent and conversion-friendly from the first enquiry.</p>
          </div>
          <div className="brand-device tilt">
            <img src="/images/solglow-mark.png" alt="" />
            <span>Consult. Design. Install. Support.</span>
          </div>
        </div>
      </Section>
      <ServiceShowcase />
      <ProofBand />
      <WhyCards />
      <BenefitBand />
      <Process />
      <GalleryPreview />
      <FAQ items={pageFaqs.home} />
      <CTA openPopup={openPopup} />
    </>
  );
}

function ServiceShowcase() {
  return (
    <Section eyebrow="Solutions" title="Complete clean-energy systems for every type of power requirement.">
      <div className="service-showcase">
        {serviceData.map((service) => (
          <Link className="service-card tilt" key={service.path} to={service.path}>
            <img src={service.image} alt={service.title} />
            <div className="service-card-body">
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <strong>View solution</strong>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function WhyCards() {
  return (
    <Section eyebrow="Why choose Solglow" title="A premium execution framework built around confidence and savings.">
      <div className="mini-grid">
        {why.map((item, index) => <article className="mini-card tilt" key={item}><span className="mini-num">0{index + 1}</span><h3>{item}</h3><p>Structured, customer-first execution that keeps the solar decision clear and dependable.</p></article>)}
      </div>
    </Section>
  );
}

function BenefitBand() {
  return (
    <Section eyebrow="Solar benefits" title="A smarter energy decision with visible long-term value.">
      <div className="benefit-wrap">
        {benefits.map((item) => <article className="benefit tilt" key={item}><span />{item}</article>)}
      </div>
    </Section>
  );
}

function ProofBand() {
  return (
    <Section eyebrow="Proven delivery" title="A Kerala solar team with measurable project credibility.">
      <div className="proof-grid">
        {proofStats.map(([value, label]) => <article className="stat-card tilt proof-card" key={label}><strong>{value}</strong><span>{label}</span></article>)}
      </div>
    </Section>
  );
}

function Process() {
  return (
    <Section eyebrow="Process" title="A clear path from enquiry to dependable solar support.">
      <div className="process">
        {process.map((step, index) => <article className="process-step tilt" key={step}><span>{index + 1}</span><h3>{step}</h3><p>{["Understand your need", "Inspect roof and site", "Plan system capacity", "Execute clean install", "Maintain performance"][index]}</p></article>)}
      </div>
    </Section>
  );
}

function FAQ({ items }) {
  return (
    <Section eyebrow="FAQ" title="Answers that help customers move forward with confidence.">
      <div className="faq-grid">
        {items.map(([question, answer]) => <article className="faq-card tilt" key={question}><h3>{question}</h3><p>{answer}</p></article>)}
      </div>
    </Section>
  );
}

function GalleryPreview() {
  const items = [
    ["/images/project-residential.png", "Residential rooftop installations", "Premium home solar"],
    ["/images/service-on-grid.png", "Grid-connected solar plants", "On-grid systems"],
    ["/images/service-off-grid.png", "Solar plus battery systems", "Off-grid resilience"],
    ["/images/service-water-heater.png", "Solar water heaters", "Thermal savings"],
    ["/images/service-street-lights.png", "Solar street lights", "Outdoor infrastructure"],
    ["/images/project-commercial.png", "Commercial and industrial arrays", "Business energy"]
  ];
  return (
    <Section eyebrow="Projects / Gallery" title="Image-led proof points that make the brand feel credible and premium.">
      <div className="project-grid">
        {items.map(([src, title, tag]) => <article className="project-card tilt" key={title}><img src={src} alt={title} /><div><span>{tag}</span><h3>{title}</h3></div></article>)}
      </div>
    </Section>
  );
}

function About({ openPopup }) {
  return (
    <>
      <Hero eyebrow="About Solglow" title="A Kerala-based solar company with a global, premium service mindset." text="Solglow Power Solutions Pvt Ltd helps homes, businesses and industries reduce energy costs and move toward reliable sustainable power." image="/images/project-commercial.png" variant="inner" />
      <Section eyebrow="Who we are" title="A complete solar solutions partner from Kochi.">
        <div className="editorial-layout">
          <div>
            <p className="lead">Solglow delivers residential, commercial and industrial solar rooftop solutions, on-grid and off-grid solar power plants, solar water heaters, solar street lights, backup solutions and batteries.</p>
            <p>The company is positioned around practical consultation, customized system design, quality product selection, reliable installation and long-term support. The goal is simple: help customers make a confident clean-energy investment.</p>
            <p>With a dedicated 25+ member team, 800+ projects delivered and landmark work such as the 180 kW IOCL Parippalli solar project, Solglow brings both technical discipline and regional service reach to Kerala customers.</p>
          </div>
          <div className="glass-list">
            {why.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </Section>
      <ProofBand />
      <Process />
      <ServiceShowcase />
      <FAQ items={pageFaqs.about} />
      <CTA openPopup={openPopup} title="Want a solar partner that understands both design and performance?" />
    </>
  );
}

function ServicePage({ service, openPopup }) {
  return (
    <>
      <Hero eyebrow={service.eyebrow} title={service.title} text={service.summary} image={service.image} variant="service">
        <div className="hero-actions"><Magnetic className="btn-primary" onClick={openPopup}>Get Free Consultation</Magnetic><Link className="btn btn-ghost" to="/contact">Talk to Solglow</Link></div>
      </Hero>
      <section className="floating-stats service-stats reveal is-visible">
        {service.metrics.map(([big, small]) => <article className="stat-card tilt" key={big + small}><strong>{big}</strong><span>{small}</span></article>)}
      </section>
      <Section eyebrow="Service overview" title={`Premium ${service.title.toLowerCase()} planned around real site performance.`}>
        <div className="service-detail">
          <div className="service-copy">
            <p className="lead">{service.lead}</p>
            <p>{service.processNote}</p>
            <div className="pill-row">
              {service.applications.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="visual-card tilt">
            <img src={service.image} alt={service.title} />
            <div><span>{service.icon}</span><strong>{service.title}</strong></div>
          </div>
        </div>
      </Section>
      <Section eyebrow="Benefits" title="What this solution gives you.">
        <div className="feature-grid">
          {service.benefits.map((item, index) => <article className="feature-card tilt" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{service.title} is planned around practical site conditions, quality components, safe execution and long-term service support.</p></article>)}
        </div>
      </Section>
      <Process />
      <FAQ items={[
        [`Who is ${service.title.toLowerCase()} best for?`, `${service.title} is best for ${service.applications.join(", ").toLowerCase()} where the customer wants a practical, reliable clean-energy solution.`],
        ["How does Solglow size the system?", "The team reviews usage pattern, site condition, available space, support expectations and future expansion before recommending a configuration."],
        ["What happens after installation?", "Solglow keeps the focus on handover clarity, performance guidance, support and maintenance so the system remains dependable."]
      ]} />
      <ContactStrip openPopup={openPopup} />
      <CTA openPopup={openPopup} title={`Ready to discuss ${service.title.toLowerCase()}?`} text="Share your site details and Solglow will help you understand the right system, next steps and callback path." />
    </>
  );
}

function WhySolar({ openPopup }) {
  return (
    <>
      <Hero eyebrow="Why solar" title="Solar is no longer optional for smart energy users." text="It reduces power bills, improves energy independence, supports sustainability and creates a better long-term energy position for homes and businesses." image="/images/service-on-grid.png" variant="inner" />
      <BenefitBand />
      <Section eyebrow="Financial and environmental value" title="Solar combines practical savings with a cleaner future.">
        <div className="feature-grid">
          {[
            ["Bill control", "Reduce dependence on unpredictable electricity bills with a system planned around your actual consumption."],
            ["Future-ready property", "Solar adds a modern clean-energy layer to homes, commercial buildings and industrial facilities."],
            ["Low operating effort", "Quality solar systems are designed for long service life with simple maintenance expectations."],
            ["Reduced carbon footprint", "Every unit generated from solar supports a cleaner, more responsible energy future."],
            ["Backup compatibility", "Solar can be planned with backup and battery strategies for stronger energy continuity."],
            ["Long-term confidence", "A professional partner helps customers understand performance, support and savings before they invest."]
          ].map(([item, text], index) => <article className="feature-card tilt" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{text}</p></article>)}
        </div>
      </Section>
      <Process />
      <FAQ items={pageFaqs.whySolar} />
      <CTA openPopup={openPopup} title="Make your energy decision cleaner, smarter and more predictable." />
    </>
  );
}

function Projects({ openPopup }) {
  return (
    <>
      <Hero eyebrow="Projects / Gallery" title="A premium gallery system ready for real Solglow installations." text="Use these polished placeholders now, then replace them with verified residential, commercial and industrial project images as the portfolio grows." image="/images/project-residential.png" variant="inner" />
      <GalleryPreview />
      <ProofBand />
      <Section eyebrow="Portfolio categories" title="Organized for the way customers evaluate solar partners.">
        <div className="feature-grid">
          {[
            ["Residential rooftops", "Show finished home installations with clean panel layouts, roof fitment and homeowner-friendly outcomes."],
            ["Commercial buildings", "Present offices, showrooms and institutions with system capacity, business use case and savings intent."],
            ["Industrial rooftops", "Demonstrate larger installations for high-consumption users where scale and reliability matter."],
            ["On-grid plants", "Feature grid-connected systems with plant size, expected generation and installation context."],
            ["Off-grid systems", "Highlight battery-backed systems for resilience, remote locations and independent power needs."],
            ["Street light projects", "Show outdoor lighting projects with pole layouts, road/campus use cases and night-time visibility."]
          ].map(([item, text], index) => <article className="feature-card tilt" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{text}</p></article>)}
        </div>
      </Section>
      <Process />
      <FAQ items={pageFaqs.projects} />
      <CTA openPopup={openPopup} title="Have a project site ready for solar assessment?" />
    </>
  );
}

function ContactStrip({ openPopup }) {
  const revealClass = useRevealClass("contact-strip");
  return (
    <section className={revealClass}>
      <div>
        <span className="eyebrow">Need guidance?</span>
        <h2>Speak with Solglow before choosing your system.</h2>
      </div>
      <Magnetic className="btn-primary" onClick={openPopup}>Open Enquiry Form</Magnetic>
      <a className="btn btn-ghost" href={`tel:+91${contact.mobile}`}>Call {contact.mobile}</a>
    </section>
  );
}

function ContactPage({ openPopup }) {
  return (
    <>
      <Hero eyebrow="Contact us" title="Talk to Solglow about your solar project." text="Get professional guidance for rooftop solar, solar plants, water heaters, street lights, backup solutions and batteries." image="/images/service-water-heater.png" variant="inner" />
      <Section eyebrow="Before you call" title="A clearer enquiry helps Solglow recommend the right clean-energy path.">
        <div className="feature-grid">
          {[
            ["Share your location", "Tell us where the site is located so the team can understand climate, access and service context."],
            ["Mention your usage", "A recent electricity bill or approximate consumption helps guide system sizing conversations."],
            ["Describe your roof or site", "Roof type, available space and shade conditions help narrow down the right solution."],
            ["Choose your service", "Select rooftop solar, power plants, water heaters, street lights, backup or batteries."],
            ["Set your priority", "Savings, backup, independence or sustainability goals help shape the recommendation."],
            ["Request a callback", "The enquiry form includes captcha validation and a clear path for Solglow to respond."]
          ].map(([item, text], index) => <article className="feature-card tilt" key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{text}</p></article>)}
        </div>
      </Section>
      <Section eyebrow="Enquiry" title="Share your requirement and get a callback.">
        <div className="contact-layout">
          <ContactCard />
          <EnquiryForm />
        </div>
      </Section>
      <Process />
      <FAQ items={pageFaqs.contact} />
      <CTA openPopup={openPopup} title="Prefer a quick callback instead?" />
    </>
  );
}

function ContactCard() {
  return (
    <article className="contact-card tilt">
      <img src="/images/solglow-mark.png" alt="" />
      <h3>{contact.company}</h3>
      <p><strong>Corp Off:</strong> {contact.address}</p>
      <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>Phone: {contact.phone}</a>
      <a href={`tel:+91${contact.mobile}`}>Mobile: {contact.mobile}</a>
      <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
      <a href="https://www.solglowpowers.com">Website: {contact.website}</a>
      <div className="director"><strong>{contact.director}</strong><span>Director</span><a href={`tel:+91${contact.mobile}`}>Mobile: {contact.mobile}</a></div>
      <div className="socials">{social.map(([name, icon, url]) => <a key={name} href={url} aria-label={name}><Icon name={icon} /></a>)}</div>
    </article>
  );
}

function Footer({ openPopup }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/images/solglow-mark.png" alt="Solglow logo" />
        <strong>Solglow Power Solutions Pvt Ltd</strong>
        <p>Premium renewable energy solutions for homes, businesses and industries across Kerala, backed by consultation, quality installation and O&M support.</p>
        <Magnetic className="btn-primary footer-whatsapp" onClick={openPopup}><Icon name="whatsapp" /> WhatsApp / Enquire</Magnetic>
      </div>
      <div><h3>Quick Links</h3>{pages.filter((page) => ["/", "/about", "/projects-gallery", "/why-solar", "/contact"].includes(page.path)).map((page) => <Link key={page.path} to={page.path}>{page.label}</Link>)}</div>
      <div><h3>Services</h3>{serviceData.map((service) => <Link key={service.path} to={service.path}>{service.title}</Link>)}</div>
      <div><h3>Contact</h3><p>{contact.address}</p><a href={`tel:+91${contact.mobile}`}>{contact.mobile}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><div className="socials">{social.map(([name, icon, url]) => <a key={name} href={url} aria-label={name}><Icon name={icon} /></a>)}</div></div>
      <div className="developer-credit">
        <span>Copyright 2026 Solglow Power Solutions Pvt Ltd. All rights reserved.</span>
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
    const label = pages.find((page) => page.path === path)?.label || serviceData.find((service) => service.path === path)?.nav || "Home";
    document.title = `${label} | Solglow Power Solutions Pvt Ltd`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `${label} by Solglow Power Solutions Pvt Ltd in Kochi, Kerala. Premium solar rooftop, power plant, backup and clean energy solutions.`);
  }, [path]);

  if (path === "/") return <Home openPopup={openPopup} />;
  if (path === "/about") return <About openPopup={openPopup} />;
  if (path === "/projects-gallery") return <Projects openPopup={openPopup} />;
  if (path === "/why-solar") return <WhySolar openPopup={openPopup} />;
  if (path === "/contact") return <ContactPage openPopup={openPopup} />;
  const service = serviceData.find((item) => item.path === path);
  return service ? <ServicePage service={service} openPopup={openPopup} /> : <Home openPopup={openPopup} />;
}

function App() {
  const [popup, setPopup] = useState(false);
  const openPopup = () => {
    sessionStorage.setItem("solglowPopupShown", "true");
    setPopup(true);
  };
  const closePopup = () => {
    sessionStorage.setItem("solglowPopupShown", "true");
    setPopup(false);
  };
  useEffect(() => {
    if (sessionStorage.getItem("solglowPopupShown") === "true") return undefined;
    const show = () => {
      if (sessionStorage.getItem("solglowPopupShown") === "true") return;
      sessionStorage.setItem("solglowPopupShown", "true");
      setPopup(true);
    };
    const timer = setTimeout(show, 15000);
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.5) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.13 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    document.querySelectorAll(".reveal").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add("is-visible");
    });
    return () => observer.disconnect();
  });
  useEffect(() => {
    const onScroll = () => document.documentElement.style.setProperty("--scroll", String(window.scrollY * 0.08));
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const move = (event) => {
      const card = event.target.closest?.(".tilt");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--rx", `${((event.clientY - rect.top) / rect.height - 0.5) * -8}deg`);
      card.style.setProperty("--ry", `${((event.clientX - rect.left) / rect.width - 0.5) * 8}deg`);
    };
    const leave = (event) => {
      const card = event.target.closest?.(".tilt");
      if (card) {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
    };
  }, []);
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Header openPopup={openPopup} />
      <main><Router openPopup={openPopup} /></main>
      <Footer openPopup={openPopup} />
      <Popup visible={popup} close={closePopup} />
      <a className="whatsapp" href="https://wa.me/919847055764" aria-label="Chat on WhatsApp"><Icon name="whatsapp" /><span>Chat on WhatsApp</span></a>
      <a className="mobile-call" href={`tel:+91${contact.mobile}`}>Call Now</a>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
