import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

const projects = [
  { title: "AutoExport AI ERP / AutoSphere", type: "Automotive SaaS ERP", description: "White-label, multi-tenant ERP for vehicle trading groups with inventory, CRM, quotations, finance, documents, reports, and permission-aware AI workflows.", tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "RLS", "AI Automation"], image: "/assets/project-autosphere.png" },
  { title: "AI SmartChoice", type: "AI Affiliate SaaS", description: "High-performance bilingual affiliate platform that scrapes Amazon products and uses AI to generate objective verdicts, review summaries, pros, cons, scores, price insights, and social content.", tags: ["Next.js 14", "TypeScript", "Supabase", "Ollama", "Python Scraping", "i18n"], image: "/assets/project-ai-smartchoice.png" },
  { title: "Local AI Desktop Assistant", type: "Private Agentic AI", description: "Voice-activated local assistant with 100+ tools for PC control, file management, reminders, OCR screen reading, and safe system automation.", tags: ["Python", "LangChain", "Ollama", "Docker", "PyAutoGUI", "Speech"], image: "/assets/project-desktop-assistant.png" },
  { title: "Enterprise RAG Support Chatbot", type: "Customer Support AI", description: "Production-ready RAG chatbot built on 768K+ support records with semantic search, source context, streaming, feedback, and multi-turn memory.", tags: ["Python", "LangChain", "ChromaDB", "Ollama", "Gradio", "Docker"], image: "/assets/project-rag-chatbot.png" },
  { title: "Gemini Subagents", type: "Open-source Agent Orchestration", description: "Manager-and-workers orchestration skill for building higher-quality websites faster. A manager agent owns design direction and review while Gemini workers generate implementation in parallel.", tags: ["Claude Code", "Gemini CLI", "Antigravity", "Multi-agent", "Open Source"], image: "/assets/project-gemini-subagents.png", url: "https://github.com/taherfarg/claude-antigravity-subagents" },
  { title: "Arabic Legal Document OCR", type: "Document Intelligence", description: "GPU-enabled OCR pipeline for scanned Arabic legal documents with PDF batching, bilingual prompts, preprocessing, and ordered text extraction.", tags: ["Python", "PyTorch", "CUDA", "Gemma 3", "OCR", "PDF Processing"], image: "/assets/project-arabic-ocr.png" },
  { title: "Traffic Speed & Violation System", type: "Real-time Computer Vision", description: "Vehicle detection, tracking, perspective-based speed estimation, traffic analytics, and automated violation capture.", tags: ["Python", "YOLOv8", "OpenCV", "ByteTrack", "Flask"], image: "/assets/project-traffic-vision.png" },
  { title: "NeurAI Brain Tumor Detection", type: "Healthcare AI", description: "Web-based MRI classification system for Glioma, Meningioma, and Pituitary tumors with visual predictions and confidence scores.", tags: ["TensorFlow", "Deep Learning", "Flask", "Medical Imaging"], image: "/assets/project-neurai.png" },
];

const skillGroups = [
  { title: "AI & Machine Learning", skills: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Transformers", "LLMs", "RAG", "OCR", "Prompt Engineering"] },
  { title: "Frameworks & GenAI", skills: ["PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face", "LangChain", "LangGraph", "OpenAI API", "Ollama", "ChromaDB"] },
  { title: "Backend & Product", skills: ["Python", "FastAPI", "Flask", "Pydantic", "Node.js", "TypeScript", "React", "Next.js", "REST APIs", "Streamlit", "Gradio"] },
  { title: "Data & Storage", skills: ["PostgreSQL", "Supabase", "MySQL", "SQL", "Pandas", "NumPy", "Embeddings", "Supabase Auth", "RLS", "Cloud Storage"] },
  { title: "Cloud & MLOps", skills: ["AWS", "Azure", "GCP", "Azure AI", "Azure ML", "Docker", "Kubernetes", "MLflow", "CI/CD", "Model Serving", "Monitoring"] },
  { title: "Automation & Tools", skills: ["n8n", "Git", "Linux", "Power BI", "Jupyter", "Playwright", "Vitest", "Logging", "Testing", "API Deployment"] },
];

const experience = [
  { role: "AI Engineer & Full-Stack Developer", company: "Pollux Motors", location: "Dubai, UAE", date: "Apr 2025 — Present", points: ["Build and maintain production systems for automotive import/export operations, including the website, vehicle listings, APIs, and internal tools.", "Designed an AI customer-support chatbot connected to internal vehicle data for availability, specifications, and booking questions.", "Automated lead collection, qualification, follow-up, and booking workflows with n8n, Google Sheets, Gmail, and internal integrations.", "Developed face-recognition and QR attendance tooling plus AI-assisted vehicle marketing workflows."] },
  { role: "AI Engineer Intern", company: "Information Technology Institute (ITI)", location: "Fayoum, Egypt", date: "Sep 2023 — Nov 2023", points: ["Built machine learning and deep learning models for classification and prediction using real-world datasets.", "Worked across preprocessing, feature engineering, model evaluation, visualization, medical image classification, and object detection.", "Presented practical AI demos covering model training, evaluation, and deployment fundamentals."] },
];

const certifications = [
  "IBM Data Science Professional Certificate — IBM / Coursera",
  "DeepLearning.AI TensorFlow Developer — DeepLearning.AI",
  "Machine Learning Specialization — DeepLearning.AI & Stanford University",
  "Deep Learning Specialization — DeepLearning.AI",
];

const explorations = [
  { src: "/assets/ai-agent.svg", title: "Agentic AI Systems" },
  { src: "/assets/rag-system.svg", title: "Enterprise RAG" },
  { src: "/assets/computer-vision.svg", title: "Computer Vision" },
  { src: "/assets/document-ocr.svg", title: "Document OCR" },
  { src: "/assets/mlops-cloud.svg", title: "Cloud & MLOps" },
  { src: "/assets/automation-erp.svg", title: "Business Automation" },
];

function VideoBackground({ flipped = false }: { flipped?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let hls: Hls | undefined;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => undefined));
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;
    }
    return () => hls?.destroy();
  }, []);
  return <video ref={ref} muted loop autoPlay playsInline className={`absolute inset-0 h-full w-full object-cover ${flipped ? "scale-y-[-1]" : ""}`} />;
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const words = ["Build", "Deploy", "Automate"];
  useEffect(() => {
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const value = Math.min(100, Math.floor(((now - start) / 2700) * 100));
      setCount(value);
      if (value < 100) id = requestAnimationFrame(tick);
      else setTimeout(onComplete, 400);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [onComplete]);
  return (
    <motion.div exit={{ opacity: 0, transition: { duration: .65 } }} className="fixed inset-0 z-[9999] bg-bg">
      <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute left-6 top-6 text-[10px] uppercase tracking-[.35em] text-muted md:left-10 md:top-10">Portfolio / 2026</motion.p>
      <div className="absolute inset-0 grid place-items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span key={Math.min(2, Math.floor(count / 34))} initial={{ opacity: 0, y: 20 }} animate={{ opacity: .8, y: 0 }} exit={{ opacity: 0, y: -20 }} className="font-display text-5xl italic md:text-7xl lg:text-8xl">
            {words[Math.min(2, Math.floor(count / 34))]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="absolute bottom-8 right-6 font-display text-7xl tabular-nums md:bottom-10 md:right-10 md:text-9xl">{String(count).padStart(3, "0")}</span>
      <div className="absolute bottom-0 h-[3px] w-full bg-stroke/50"><div className="accent-gradient h-full origin-left" style={{ transform: `scaleX(${count / 100})`, boxShadow: "0 0 8px rgba(137,170,204,.4)" }} /></div>
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Work", id: "work" },
    { label: "Experience", id: "experience" },
    { label: "Contact", id: "contact" },
  ];
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 100);
      const current = links
        .map((link) => document.getElementById(link.id))
        .filter(Boolean)
        .reduce<HTMLElement | null>((match, section) => section!.getBoundingClientRect().top <= 140 ? section : match, null);
      if (current?.id) setActive(current.id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const go = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:pt-6">
      <div className={`mx-auto hidden w-fit items-center gap-1 rounded-full border border-white/10 bg-surface/80 p-2 backdrop-blur-xl transition-shadow md:flex ${scrolled ? "shadow-xl shadow-black/40" : ""}`}>
        <button onClick={() => go("#home")} aria-label="Home" className="group grid h-9 w-9 place-items-center rounded-full accent-gradient">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-bg font-display text-sm italic transition-transform group-hover:scale-90">TF</span>
        </button>
        <span className="mx-1 h-5 w-px bg-stroke" />
        {links.map((link) => <button key={link.id} onClick={() => go(`#${link.id}`)} className={`rounded-full px-3 py-2 text-xs transition lg:px-4 ${active === link.id ? "bg-stroke/70 text-text-primary" : "text-muted hover:bg-stroke/60 hover:text-text-primary"}`}>{link.label}</button>)}
        <span className="mx-1 h-5 w-px bg-stroke" />
        <a href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="gradient-border rounded-full bg-surface px-3 py-2 text-xs sm:px-4">WhatsApp <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>
      </div>
      <div className={`relative mx-auto flex max-w-md items-center justify-between rounded-full border border-white/10 bg-surface/85 p-2 pl-2.5 backdrop-blur-xl transition-shadow md:hidden ${scrolled ? "shadow-xl shadow-black/40" : ""}`}>
        <button onClick={() => go("#home")} aria-label="Home" className="group grid h-10 w-10 place-items-center rounded-full accent-gradient">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-bg font-display text-sm italic transition-transform group-active:scale-90">TF</span>
        </button>
        <button onClick={() => go(`#${active}`)} className="rounded-full px-3 py-2 text-[10px] uppercase tracking-[.2em] text-muted">{links.find((link) => link.id === active)?.label}</button>
        <div className="flex items-center gap-1.5">
          <a aria-label="Chat on WhatsApp" href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-stroke bg-bg text-text-primary"><ArrowUpRight className="h-4 w-4" /></a>
          <button onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="grid h-10 w-10 place-items-center rounded-full border border-stroke bg-bg text-text-primary">
            <AnimatePresence mode="wait" initial={false}>{menuOpen ? <motion.span key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}><X className="h-4 w-4" /></motion.span> : <motion.span key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}><Menu className="h-4 w-4" /></motion.span>}</AnimatePresence>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -15, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .97 }} transition={{ duration: .25 }} className="mx-auto mt-2 max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-surface/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-2xl md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {links.map((link, i) => <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .035 }} key={link.id} onClick={() => go(`#${link.id}`)} className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm transition ${active === link.id ? "border-[#89aacc]/40 bg-[#102136] text-text-primary" : "border-stroke bg-bg/60 text-muted"}`}><span>{link.label}</span><span className="font-display text-lg italic">{String(i + 1).padStart(2, "0")}</span></motion.button>)}
            </div>
            <a href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="accent-gradient mt-2 flex items-center justify-between rounded-2xl px-5 py-4 text-sm text-bg"><span>Start a WhatsApp conversation</span><ArrowUpRight className="h-4 w-4" /></a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [role, setRole] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setRole((r) => (r + 1) % 4), 2000);
    return () => clearInterval(timer);
  }, []);
  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".name-reveal", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.25, delay: .1 })
        .fromTo(".blur-in", { opacity: 0, filter: "blur(10px)", y: 20 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: .1 }, "-=.75");
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);
  const roles = ["AI Engineer", "LLM Builder", "CV Developer", "MLOps Engineer"];
  return (
    <section id="home" ref={sectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
      <VideoBackground />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center pt-16">
        <p className="blur-in mb-8 text-[10px] uppercase tracking-[.4em] text-white/55">Production AI · Dubai</p>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[.84] tracking-[-.04em] md:text-8xl lg:text-[8rem]">Taher Farg<span className="sr-only"> — AI Engineer &amp; Full-Stack AI Developer in Dubai</span></h1>
        <p className="blur-in mb-5 text-sm text-white/70 md:text-base">An <span key={role} className="animate-role-fade-in inline-block font-display text-xl italic text-white md:text-2xl">{roles[role]}</span> based in Dubai.</p>
        <p className="blur-in mb-10 max-w-xl text-sm leading-7 text-white/55 md:text-base">I turn business problems into deployable AI products across LLM applications, computer vision, OCR, and intelligent automation.</p>
        <div className="blur-in flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <a href="#work" className="gradient-border rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg transition duration-300 hover:scale-105 hover:bg-bg hover:text-text-primary">See works <ArrowDownRight className="ml-2 inline h-4 w-4" /></a>
          <a href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="gradient-border rounded-full bg-bg/80 px-7 py-3.5 text-sm ring-1 ring-stroke transition duration-300 hover:scale-105">WhatsApp me</a>
        </div>
      </div>
      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[.3em] text-white/45">
        Scroll <span className="relative h-9 w-px overflow-hidden bg-white/20"><span className="animate-scroll-down absolute inset-x-0 top-0 h-1/2 accent-gradient" /></span>
      </div>
    </section>
  );
}

function About() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", toggleActions: "play none none none" },
        defaults: { ease: "power3.out" },
      });
      tl.fromTo(".about-frame", { clipPath: "inset(100% 0% 0% 0%)", y: 55, rotate: -5 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, rotate: -2, duration: 1.15 })
        .fromTo(".about-copy > *", { opacity: 0, y: 24, filter: "blur(7px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .75, stagger: .09 }, "-=.72");
      gsap.to(".about-photo", { yPercent: -8, scale: 1.06, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(".about-glow", { y: -45, x: 20, rotate: 8, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 } });
    }, sectionRef);
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 3300);
    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);
  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden border-b border-stroke bg-bg py-20 md:py-32">
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="about-glow accent-gradient pointer-events-none absolute -right-40 top-20 h-72 w-72 rounded-full opacity-10 blur-[110px] md:h-[30rem] md:w-[30rem]" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:grid-cols-[.85fr_1.15fr] md:px-10 lg:gap-20 lg:px-16">
        <div className="about-frame relative mx-auto w-full max-w-[420px]">
          <div className="about-glow accent-gradient absolute -inset-3 rotate-[-3deg] rounded-[36px] opacity-35 blur-xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-surface p-2 shadow-2xl shadow-black/50 transition duration-500 hover:rotate-2 hover:scale-[1.015]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[26px]">
              <img src="/assets/taher-farg.webp" srcSet="/assets/taher-farg.webp 868w, /taher-farg-portrait.jpg 1200w" sizes="(min-width: 768px) 420px, 100vw" width={868} height={1280} fetchPriority="high" alt="Taher Farg Ibrahim, AI Engineer and Full-Stack AI Developer based in Dubai" className="about-photo h-[112%] w-full object-cover object-[50%_25%] transition duration-700 hover:scale-[1.08]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <div><p className="font-display text-2xl italic">Taher Farg</p><p className="mt-1 text-[9px] uppercase tracking-[.24em] text-white/55">AI Engineer · Dubai</p></div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-md"><span className="h-2 w-2 rounded-full bg-emerald-400" /></span>
              </div>
            </div>
          </div>
        </div>
        <div className="about-copy">
          <div className="mb-5 flex items-center gap-3"><span className="h-px w-8 bg-stroke" /><span className="text-[10px] uppercase tracking-[.35em] text-muted">About me</span></div>
          <h2 className="mb-7 text-5xl font-light tracking-[-.05em] md:text-7xl">Engineering AI that <span className="font-display italic">ships.</span></h2>
          <p className="mb-5 text-sm leading-7 text-muted md:text-base">I am an AI Engineer and Full-Stack AI Developer based in Dubai, specialized in building production systems across LLM applications, RAG chatbots, computer vision, OCR, and business automation.</p>
          <p className="mb-8 text-sm leading-7 text-muted md:text-base">I combine AI engineering with product development, cloud deployment, APIs, databases, testing, logging, and monitoring to turn business challenges into reliable tools people can actually use.</p>
          <div className="mb-8 grid grid-cols-2 gap-3">
            {[["Based in", "Dubai, UAE"], ["Focus", "Production AI"], ["Languages", "Arabic · English"], ["Status", "Open to opportunities"]].map(([label, value]) => <motion.div key={label} whileHover={{ y: -5, borderColor: "rgba(137,170,204,.65)" }} transition={{ duration: .25 }} className="rounded-2xl border border-stroke bg-surface/50 p-4"><p className="mb-2 text-[9px] uppercase tracking-[.2em] text-muted">{label}</p><p className="text-sm">{value}</p></motion.div>)}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .97 }} href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="gradient-border inline-flex justify-center rounded-full bg-text-primary px-7 py-3.5 text-sm text-bg">Chat on WhatsApp <ArrowUpRight className="ml-3 h-4 w-4" /></motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: .97 }} href="mailto:taherfarg50@gmail.com" className="gradient-border inline-flex justify-center rounded-full bg-bg px-7 py-3.5 text-sm ring-1 ring-stroke">Email me <ArrowUpRight className="ml-3 h-4 w-4" /></motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, first, italic, description, action }: { eyebrow: string; first: string; italic: string; description: string; action: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .9 }} className="mb-10 flex items-end justify-between md:mb-14">
      <div>
        <div className="mb-5 flex items-center gap-3"><span className="h-px w-8 bg-stroke" /><span className="text-[10px] uppercase tracking-[.35em] text-muted">{eyebrow}</span></div>
        <h2 className="mb-4 text-4xl font-light tracking-[-.04em] md:text-6xl">{first} <span className="font-display italic">{italic}</span></h2>
        <p className="max-w-md text-sm leading-6 text-muted">{description}</p>
      </div>
      <button className="gradient-border hidden rounded-full bg-bg px-6 py-3 text-xs ring-1 ring-stroke md:inline-flex">{action}<ArrowRight className="ml-4 h-4 w-4" /></button>
    </motion.div>
  );
}

function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".skill-chip", { opacity: 0, scale: .7, y: 8 }, {
        opacity: 1, scale: 1, y: 0, duration: .35, stagger: .018, ease: "back.out(1.8)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 58%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section id="skills" ref={sectionRef} className="relative overflow-hidden border-y border-stroke bg-[#080808] py-20 md:py-28">
      <div className="accent-gradient pointer-events-none absolute -left-48 top-1/3 h-80 w-80 rounded-full opacity-[.06] blur-[120px]" />
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow="Technical capabilities" first="Complete" italic="toolkit" description="A production-focused stack spanning AI research, application engineering, cloud deployment, and automation." action="50+ technologies" />
        <div className="grid gap-4 [perspective:1200px] md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <motion.article key={group.title} initial={{ opacity: 0, y: 70, rotateX: -18, scale: .94 }} whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} viewport={{ once: true, margin: "-80px" }} whileHover={{ y: -9, scale: 1.015 }} transition={{ duration: .75, delay: (i % 3) * .08, ease: [0.25, 0.1, 0.25, 1] }} className="skill-card group relative overflow-hidden rounded-3xl border border-stroke bg-surface/50 p-6">
              <div className="card-shine pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="accent-gradient absolute inset-x-8 top-0 h-px origin-left scale-x-0 transition duration-500 group-hover:scale-x-100" />
              <div className="mb-6 flex items-center justify-between">
                <h3 className="relative font-display text-2xl italic transition duration-300 group-hover:text-white">{group.title}</h3>
                <span className="relative font-display text-xl italic text-muted transition duration-500 group-hover:rotate-[360deg] group-hover:text-[#89aacc]">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="relative flex flex-wrap gap-2">
                {group.skills.map((skill) => <span key={skill} className="skill-chip rounded-full border border-stroke bg-bg px-3 py-2 text-[10px] uppercase tracking-[.12em] text-muted transition duration-300 hover:-translate-y-1 hover:border-[#6f9fce] hover:bg-[#102136] hover:text-text-primary">{skill}</span>)}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
        const image = card.querySelector(".project-image");
        if (image) gsap.fromTo(image, { yPercent: -5, scale: 1.08 }, { yPercent: 5, scale: 1.08, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-bg py-20 md:py-28">
      <div className="accent-gradient pointer-events-none absolute -right-48 top-1/4 h-96 w-96 rounded-full opacity-[.05] blur-[130px]" />
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow="Complete project archive" first="Production" italic="AI projects" description="End-to-end AI products built across SaaS, automotive, customer support, agent orchestration, document processing, traffic analytics, and healthcare." action="8 featured systems" />
        <div className="grid grid-cols-1 gap-5 [perspective:1400px] md:grid-cols-2 md:gap-6">
          {projects.map((project, i) => (
            <motion.article initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70, y: 45, rotateY: i % 2 === 0 ? 7 : -7 }} whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0 }} viewport={{ once: true, margin: "-90px" }} whileHover={{ y: -10 }} transition={{ duration: .85, delay: (i % 2) * .08, ease: [0.25, 0.1, 0.25, 1] }} key={project.title} className="project-card group relative overflow-hidden rounded-3xl border border-stroke bg-surface shadow-2xl shadow-black/0 transition-shadow duration-500 hover:shadow-black/50">
              <div className="card-shine pointer-events-none absolute inset-0 z-20 opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="accent-gradient absolute inset-x-8 top-0 z-30 h-px origin-center scale-x-0 transition duration-500 group-hover:scale-x-100" />
              <div className="relative aspect-[1.65] overflow-hidden">
                <img src={project.image} alt={`${project.title} — ${project.type} project by Taher Farg`} loading="lazy" decoding="async" className="project-image h-[112%] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.13]" />
                <div className="halftone absolute inset-0 opacity-20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                <div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100" />
                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-bg/60 px-3 py-2 text-[9px] uppercase tracking-[.2em] backdrop-blur-lg transition duration-500 group-hover:border-[#89aacc]/50 group-hover:bg-bg/80">{project.type}</span>
              </div>
              <div className="relative p-6 md:p-7">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-medium transition duration-300 group-hover:text-white md:text-2xl">{project.title}</h3>
                  <span className="font-display text-2xl italic text-muted transition duration-500 group-hover:-translate-y-1 group-hover:text-[#89aacc]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mb-5 text-sm leading-6 text-muted">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => <span key={tag} className="rounded-full border border-stroke px-3 py-1.5 text-[9px] uppercase tracking-[.14em] text-muted transition duration-300 group-hover:border-white/15">{tag}</span>)}
                </div>
                {"url" in project && project.url && <a href={project.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center text-xs text-muted transition hover:text-text-primary">View on GitHub <ArrowUpRight className="ml-2 h-4 w-4" /></a>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader eyebrow="Professional experience" first="Building" italic="in production" description="Hands-on engineering across deployable AI, full-stack products, automation, and computer vision." action="Dubai, UAE" />
        <div className="space-y-5">
          {experience.map((item, i) => (
            <motion.article key={item.company} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: i * .08 }} className="grid gap-6 rounded-3xl border border-stroke bg-surface/40 p-6 md:grid-cols-[.75fr_1.5fr] md:p-8">
              <div>
                <p className="mb-3 text-[9px] uppercase tracking-[.25em] text-muted">{item.date}</p>
                <h3 className="mb-2 text-xl font-medium">{item.role}</h3>
                <p className="font-display text-2xl italic">{item.company}</p>
                <p className="mt-2 text-xs text-muted">{item.location}</p>
              </div>
              <ul className="space-y-4">
                {item.points.map((point) => <li key={point} className="flex gap-3 text-sm leading-6 text-muted"><Check className="mt-1 h-4 w-4 shrink-0 text-[#89aacc]" />{point}</li>)}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  return (
    <section className="border-y border-stroke bg-[#080808] py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-2 md:px-10 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-muted">Education & credentials</p>
          <h2 className="mb-7 text-4xl font-light tracking-[-.04em] md:text-5xl">Continuous <span className="font-display italic">learning</span></h2>
          <div className="mb-4 rounded-3xl border border-stroke bg-surface/50 p-6">
            <p className="mb-2 text-xs uppercase tracking-[.2em] text-muted">Fayoum University · 2020 — 2024</p>
            <h3 className="text-xl">Bachelor of Science in Computer Science</h3>
            <p className="mt-3 text-sm leading-6 text-muted">Machine Learning, Deep Learning, Data Mining, Algorithms, Databases, Software Engineering, Linear Algebra, Probability, and Statistics.</p>
          </div>
          <div className="space-y-3">
            {certifications.map((cert) => <div key={cert} className="flex gap-3 rounded-2xl border border-stroke bg-surface/30 p-4 text-sm text-muted"><Check className="h-4 w-4 shrink-0 text-[#89aacc]" />{cert}</div>)}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}>
          <p className="mb-5 text-[10px] uppercase tracking-[.35em] text-muted">Achievements & leadership</p>
          <h2 className="mb-7 text-4xl font-light tracking-[-.04em] md:text-5xl">Beyond the <span className="font-display italic">code</span></h2>
          <div className="space-y-4">
            {["Deployed AI/ML systems across automotive, healthcare, customer support, document processing, and business automation.", "Delivered AI workshops and practical demos to 100+ learners, from ML fundamentals through deployment.", "Contributor and volunteer in IEEE, Google Developer Student Club, and Microsoft Learn Student Ambassador programs.", "Arabic: Native · English: Professional working proficiency."].map((item, i) => <div key={item} className="rounded-3xl border border-stroke bg-surface/50 p-6"><span className="mb-3 block font-display text-3xl italic text-muted">{String(i + 1).padStart(2, "0")}</span><p className="text-sm leading-6 text-muted">{item}</p></div>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: sectionRef.current, start: "top top", end: "bottom bottom", pin: contentRef.current, pinSpacing: false });
      gsap.to(".parallax-left", { y: -450, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.fromTo(".parallax-right", { y: -350 }, { y: 300, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="relative min-h-[300vh] overflow-hidden bg-[#080808]">
      <div ref={contentRef} className="relative z-10 flex h-screen items-center justify-center px-6 text-center">
        <div className="max-w-lg">
          <div className="mb-5 text-[10px] uppercase tracking-[.4em] text-muted">Technical toolkit</div>
          <h2 className="mb-5 text-5xl font-light tracking-[-.05em] md:text-7xl">From model to <span className="font-display italic">production</span></h2>
          <p className="mb-8 text-sm leading-7 text-muted">Python, LangChain, LangGraph, OpenAI, Ollama, YOLO, FastAPI, React, Supabase, Docker, cloud deployment, monitoring, and automation.</p>
          <a href="https://taherfarg.com" className="gradient-border inline-flex rounded-full bg-bg px-6 py-3 text-xs ring-1 ring-stroke">Visit taherfarg.com <ArrowUpRight className="ml-3 h-4 w-4" /></a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 mx-auto grid max-w-[1400px] grid-cols-2 gap-12 px-5 md:gap-40 md:px-16">
        <div className="parallax-left flex flex-col gap-[55vh] pt-[75vh] md:items-start">
          {explorations.slice(0, 3).map((image, i) => <button onClick={() => setLightbox(image.src)} key={image.src} className="group pointer-events-auto relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 transition hover:scale-[1.03]" style={{ transform: `rotate(${[-5, 3, -3][i]}deg)` }}><img src={image.src} alt={`${image.title} — AI focus area`} loading="lazy" decoding="async" className="h-full w-full object-cover" /><span className="absolute inset-x-4 bottom-4 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-left text-[9px] uppercase tracking-[.2em] text-white/70 backdrop-blur-md transition group-hover:text-white">{image.title}</span></button>)}
        </div>
        <div className="parallax-right flex flex-col items-end gap-[60vh] pt-[100vh]">
          {explorations.slice(3).map((image, i) => <button onClick={() => setLightbox(image.src)} key={image.src} className="group pointer-events-auto relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 transition hover:scale-[1.03]" style={{ transform: `rotate(${[4, -4, 5][i]}deg)` }}><img src={image.src} alt={`${image.title} — AI focus area`} loading="lazy" decoding="async" className="h-full w-full object-cover" /><span className="absolute inset-x-4 bottom-4 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-left text-[9px] uppercase tracking-[.2em] text-white/70 backdrop-blur-md transition group-hover:text-white">{image.title}</span></button>)}
        </div>
      </div>
      <AnimatePresence>{lightbox && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)} className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-black/90 p-6 backdrop-blur-xl"><button aria-label="Close" className="absolute right-6 top-6"><X /></button><motion.img initial={{ scale: .9 }} animate={{ scale: 1 }} src={lightbox} alt="" className="max-h-[82vh] max-w-[90vw] rounded-2xl object-contain" /></motion.div>}</AnimatePresence>
    </section>
  );
}

function Stats() {
  return <section className="border-y border-stroke bg-bg py-16 md:py-24"><div className="mx-auto grid max-w-[1200px] grid-cols-1 px-6 md:grid-cols-3 md:px-10 lg:px-16">{[["100+", "Assistant tools integrated"], ["768K+", "RAG support records"], ["100+", "Learners reached"]].map(([number, label], i) => <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }} key={label} className="border-stroke py-8 text-center md:border-r md:last:border-r-0"><p className="mb-2 font-display text-7xl italic md:text-8xl">{number}</p><p className="text-[10px] uppercase tracking-[.3em] text-muted">{label}</p></motion.div>)}</div></section>;
}

function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const tween = gsap.to(marqueeRef.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    return () => { tween.kill(); };
  }, []);
  return (
    <footer id="contact" className="relative overflow-hidden bg-bg pt-20">
      <VideoBackground flipped />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg to-transparent" />
      <div className="noise absolute inset-0" />
      <div className="relative z-10">
        <div className="mb-20 overflow-hidden whitespace-nowrap border-y border-white/10 py-5 md:py-8"><div ref={marqueeRef} className="inline-block font-display text-5xl italic text-white/80 md:text-8xl">{"DEPLOYING INTELLIGENCE • ".repeat(12)}</div></div>
        <div className="mx-auto max-w-[1200px] px-6 text-center md:px-10 lg:px-16">
          <p className="mb-5 text-[10px] uppercase tracking-[.4em] text-white/50">Building an AI product?</p>
          <h2 className="mb-10 text-5xl font-light tracking-[-.05em] md:text-7xl">Let's ship it to <span className="font-display italic">production.</span></h2>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="gradient-border inline-flex rounded-full bg-white px-8 py-4 text-sm text-bg transition hover:scale-105">Chat on WhatsApp <ArrowUpRight className="ml-3 h-4 w-4" /></a>
            <a href="mailto:taherfarg50@gmail.com" className="gradient-border inline-flex rounded-full bg-bg/70 px-8 py-4 text-sm ring-1 ring-white/15 transition hover:scale-105">Send an email <ArrowUpRight className="ml-3 h-4 w-4" /></a>
          </div>
          <div className="mt-24 flex flex-col items-center justify-between gap-5 border-t border-white/10 py-8 text-[10px] uppercase tracking-[.2em] text-white/50 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-5"><a href="https://taherfarg.com" className="transition hover:text-white">Portfolio</a><a href="https://wa.me/971547224740" target="_blank" rel="noreferrer" className="transition hover:text-white">WhatsApp</a><a href="mailto:taherfarg50@gmail.com" className="transition hover:text-white">Email</a><a href="tel:+971547224740" className="transition hover:text-white">Phone</a></div>
            <div className="flex items-center gap-3"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>Dubai · Open to AI opportunities</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen onComplete={() => setLoading(false)} />}</AnimatePresence>
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <About />
        <Skills />
        <Works />
        <Experience />
        <Credentials />
        <Stats />
        <Explorations />
      </main>
      <Footer />
    </>
  );
}
