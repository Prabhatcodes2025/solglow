import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const services = [
  ["Residential Solar Rooftop Solutions", "High-efficiency rooftop systems for modern homes, designed to reduce monthly energy costs with clean power."],
  ["Commercial Solar Rooftop Solutions", "Optimized solar systems for offices, retail spaces and institutions that need predictable energy savings."],
  ["Industrial Solar Rooftop Solutions", "Robust solar infrastructure for factories, warehouses and high-consumption industrial facilities."],
  ["On-Grid Solar Power Plants", "Grid-connected power plants engineered for performance, compliance and long-term return on investment."],
  ["Off-Grid Solar Power Plants", "Independent solar systems for remote sites, farms, facilities and applications that need resilient power."],
  ["Solar Water Heaters", "Efficient solar thermal systems that reduce water-heating energy consumption for homes and businesses."],
  ["Solar Street Lights", "Smart outdoor lighting solutions for campuses, communities, roads and commercial premises."],
  ["Back-Up Solutions", "Dependable backup power planning for homes and business-critical operations."],
  ["Batteries", "Reliable battery solutions for energy storage, backup support and improved power independence."]
];

const stats = ["Residential Solar", "Commercial Solar", "Industrial Solar", "Backup & Battery Solutions"];
const whyChoose = ["Professional Solar Consultation", "Customized System Design", "Quality Products", "Reliable Installation", "Long-Term Support", "Energy Saving Focus"];
const benefits = ["Reduce electricity bills", "Clean renewable energy", "Low maintenance", "Long-term savings", "Better energy independence", "Eco-friendly future"];
const process = ["Consultation", "Site Survey", "System Design", "Installation", "Support & Maintenance"];

const contact = {
  company: "Solglow Power Solutions Pvt Ltd",
  address: "Corp Off: No.52/2321A, Pallathusseri Building, Adjacent to Hotel Broad Bean, Sahakarana Road, Vyttila Kochi, Kerala, India 682019",
  phone: "0484 2940532",
  mobile: "9847055764",
  email: "info@solglowpowers.com",
  website: "www.solglowpowers.com",
  director: "DR GOPAL SHANKAR"
};

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader ${hidden ? "preloader--hidden" : ""}`} aria-hidden={hidden}>
      <div className="solar-loader">
        <div className="sun-core" />
        <div className="panel-icon">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <p>Powering a Brighter Tomorrow</p>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [["Home", "#home"], ["About Us", "#about"], ["Solutions", "#solutions"], ["Projects", "#projects"], ["Why Solar", "#why-solar"], ["Contact Us", "#contact"]];

  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label="Solglow home">
        <span className="brand-mark">SG</span>
        <span>
          <strong>Solglow</strong>
          <small>Power Solutions Pvt Ltd</small>
        </span>
      </a>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle navigation">☰</button>
      <nav className={open ? "nav-links nav-links--open" : "nav-links"} onClick={() => setOpen(false)}>
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
    </header>
  );
}

function Section({ id, eyebrow, title, children, className = "" }) {
  return (
    <section id={id} className={`section reveal ${className}`}>
      <div className="section-heading">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2>{title}</h2>}
      </div>
      {children}
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "", captcha: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const captcha = useMemo(() => ({ question: "What is 6 + 3?", answer: "9" }), []);

  function submit(event) {
    event.preventDefault();
    if (form.captcha.trim() !== captcha.answer) {
      setError("Please solve the captcha before submitting.");
      setSent(false);
      return;
    }
    setError("");
    setSent(true);
    setForm({ name: "", phone: "", email: "", service: "", message: "", captcha: "" });
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-grid">
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Phone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
      </div>
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Service Required
        <select required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
          <option value="">Select a solution</option>
          {services.map(([name]) => <option key={name}>{name}</option>)}
        </select>
      </label>
      <label>Message<textarea rows="4" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
      <label>{captcha.question}<input required inputMode="numeric" value={form.captcha} onChange={(e) => setForm({ ...form, captcha: e.target.value })} /></label>
      {error && <p className="form-note form-note--error">{error}</p>}
      {sent && <p className="form-note">Thank you. Solglow will contact you shortly.</p>}
      <button className="btn btn-primary" type="submit">Submit Enquiry</button>
    </form>
  );
}

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.14 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <section id="home" className="hero">
          <img className="hero-img" src="/images/solglow-hero.png" alt="Modern rooftop solar panels at sunrise" />
          <div className="hero-overlay" />
          <div className="hero-content reveal is-visible">
            <span className="eyebrow">Premium solar energy partner from Kochi, Kerala</span>
            <h1>Switch to Smarter, Cleaner & Reliable Solar Energy</h1>
            <p>Premium solar rooftop, power plant and backup solutions for residential, commercial and industrial needs.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">Get Free Consultation</a>
              <a className="btn btn-ghost" href="#solutions">Explore Solutions</a>
            </div>
          </div>
          <div className="floating-stats" aria-label="Solglow solution categories">
            {stats.map((item, index) => <div className="stat-card" key={item}><span>0{index + 1}</span>{item}</div>)}
          </div>
        </section>

        <Section id="about" eyebrow="About Us" title="A trusted solar solutions company helping Kerala move toward sustainable power.">
          <div className="split">
            <div>
              <p className="lead">Solglow Power Solutions Pvt Ltd is a Kerala-based renewable energy company headquartered in Kochi, delivering dependable solar solutions for homes, businesses and industrial users.</p>
              <p>From solar rooftop systems and on-grid or off-grid power plants to solar water heaters, street lights, backup systems and batteries, Solglow focuses on practical energy savings, reliable execution and long-term customer support.</p>
            </div>
            <div className="glass-card metrics-card">
              <strong>Designed for confident solar adoption</strong>
              <span>Consultation, system sizing, installation and maintenance handled with professional care.</span>
            </div>
          </div>
        </Section>

        <Section id="solutions" eyebrow="Solutions / Services" title="Solar solutions engineered for every scale of energy need.">
          <div className="card-grid services-grid">
            {services.map(([name, desc], index) => (
              <article className="service-card" key={name}>
                <Icon>{["☀", "⌂", "▦", "⚡", "◆", "◉", "✦", "⏻", "▣"][index]}</Icon>
                <h3>{name}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" eyebrow="Projects / Gallery" title="Clean, replaceable project visuals for a premium portfolio.">
          <div className="project-grid">
            <article className="project-card">
              <img src="/images/project-residential.png" alt="Residential rooftop solar placeholder" />
              <div><span>Replaceable image</span><h3>Residential Rooftop Installations</h3></div>
            </article>
            <article className="project-card project-card--large">
              <img src="/images/solglow-hero.png" alt="Solar rooftop hero placeholder" />
              <div><span>Replaceable image</span><h3>Premium Solar Rooftop Systems</h3></div>
            </article>
            <article className="project-card">
              <img src="/images/project-commercial.png" alt="Commercial solar project placeholder" />
              <div><span>Replaceable image</span><h3>Commercial & Industrial Solar Arrays</h3></div>
            </article>
          </div>
        </Section>

        <Section id="why-solar" eyebrow="Why Choose Solglow" title="Professional guidance, quality systems and support that lasts.">
          <div className="card-grid compact-grid">
            {whyChoose.map((item) => <div className="mini-card" key={item}><Icon>✺</Icon><h3>{item}</h3></div>)}
          </div>
        </Section>

        <Section id="benefits" eyebrow="Why Solar" title="Solar is a smarter long-term energy decision.">
          <div className="benefit-wrap">
            {benefits.map((item) => <div className="benefit" key={item}><span />{item}</div>)}
          </div>
        </Section>

        <Section id="process" eyebrow="Process" title="A clear path from consultation to dependable support.">
          <div className="process">
            {process.map((step, index) => <div className="process-step" key={step}><span>{index + 1}</span><h3>{step}</h3></div>)}
          </div>
        </Section>

        <section className="cta reveal">
          <h2>Ready to reduce your power bills with solar?</h2>
          <p>Start with a professional consultation and understand the right solar solution for your site, budget and power needs.</p>
          <a className="btn btn-primary" href="#contact">Request a Callback</a>
        </section>

        <Section id="contact" eyebrow="Contact Us" title="Speak with Solglow about your solar project.">
          <div className="contact-layout">
            <div className="contact-card">
              <h3>{contact.company}</h3>
              <p>{contact.address}</p>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>Phone: {contact.phone}</a>
              <a href={`tel:+91${contact.mobile}`}>Mobile: {contact.mobile}</a>
              <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
              <a href="https://www.solglowpowers.com">Website: {contact.website}</a>
              <div className="director">
                <strong>{contact.director}</strong>
                <span>Director</span>
                <a href={`tel:+91${contact.mobile}`}>Mob: {contact.mobile}</a>
              </div>
              <div className="socials">
                <a href="https://www.facebook.com/solglowpowers">Facebook</a>
                <a href="https://www.instagram.com/solglowpower">Instagram</a>
                <a href="https://www.youtube.com/channel/UCFusZ4dQhMJQFsH0nxsiLoQ">YouTube</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="footer">
        <div><strong>Solglow Power Solutions Pvt Ltd</strong><p>Premium renewable energy solutions for homes, businesses and industries.</p></div>
        <div><strong>Services</strong><p>Solar rooftops, power plants, water heaters, street lights, backup solutions and batteries.</p></div>
        <div><strong>Contact</strong><p>{contact.email}<br />{contact.mobile}</p></div>
      </footer>
      <a className="whatsapp" href="https://wa.me/919847055764" aria-label="Chat on WhatsApp">WA</a>
      <a className="mobile-call" href="tel:+919847055764">Call Now</a>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
