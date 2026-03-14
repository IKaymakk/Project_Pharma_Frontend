import { useEffect, useRef, useState } from "react";
import {
    Mail, Phone, MapPin, Clock, Send,
    Globe2, MessageSquare, ChevronRight,
    CheckCircle2, ArrowRight, ShieldCheck,
    ChevronDown, Star, Quote, PackageCheck, Truck, Award
} from "lucide-react";
import Lenis from "lenis";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const PARALLAX_BG = 0.28;
const PARALLAX_TXT = 0.12;
const HERO_FADE = 700;

// ─────────────────────────────────────────────────────────────
// Hook: Scroll Reveal
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, v };
}

// ─────────────────────────────────────────────────────────────
// SectionLabel
// ─────────────────────────────────────────────────────────────
function SectionLabel({ children, centered = false, onDark = false }: {
    children: React.ReactNode; centered?: boolean; onDark?: boolean;
}) {
    return (
        <div className={`inline-flex items-center gap-2.5 mb-5 ${centered ? "mx-auto justify-center" : ""}`}>
            <span className={`h-px w-8 ${onDark ? "bg-blue-400/60" : "bg-blue-600/50"}`} />
            <span className={`text-[10px] font-black tracking-[0.26em] uppercase ${onDark ? "text-blue-300" : "text-blue-600"}`}>
                {children}
            </span>
            {centered && <span className={`h-px w-8 ${onDark ? "bg-blue-400/60" : "bg-blue-600/50"}`} />}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Contact Card
// ─────────────────────────────────────────────────────────────
function ContactCard({ icon: Icon, title, lines, accent }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    lines: string[];
    accent: string;
}) {
    return (
        <div className="group relative bg-white rounded-2xl p-7 border border-slate-200/70 overflow-hidden
                       hover:border-blue-200 hover:shadow-[0_24px_60px_-12px_rgba(37,99,235,0.13)]
                       transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-5 ${accent} transition-transform duration-500 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-black text-[15px] text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {title}
                </h3>
                <div className="space-y-1">
                    {lines.map((line, i) => (
                        <p key={i} className="text-[13.5px] text-slate-500 leading-relaxed font-light">{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// FAQ Item
// ─────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
                ${open
                    ? "border-blue-200 bg-blue-50/40 shadow-[0_8px_32px_-8px_rgba(37,99,235,0.1)]"
                    : "border-slate-200/80 bg-white hover:border-blue-100 hover:bg-slate-50/60"}`}
            onClick={() => setOpen(!open)}
        >
            <div className="flex items-center justify-between gap-4 px-7 py-5">
                <span className={`font-bold text-[14.5px] leading-snug transition-colors duration-300 ${open ? "text-blue-700" : "text-slate-800"}`}>
                    {question}
                </span>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                    ${open ? "bg-blue-600 rotate-180" : "bg-slate-100"}`}>
                    <ChevronDown className={`h-3.5 w-3.5 transition-colors duration-300 ${open ? "text-white" : "text-slate-500"}`} />
                </div>
            </div>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="px-7 pb-6 text-[13.5px] text-slate-500 font-light leading-[1.85]">
                    {answer}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Trust Badge
// ─────────────────────────────────────────────────────────────
function TrustBadge({ icon: Icon, label, sub }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    sub: string;
}) {
    return (
        <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/20 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/12 border border-blue-500/18 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-center">
                <div className="font-black text-[15px] text-white mb-1">{label}</div>
                <div className="text-[12px] text-slate-500 font-light">{sub}</div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Testimonial Card
// ─────────────────────────────────────────────────────────────
function TestimonialCard({ name, role, company, text, rating }: {
    name: string; role: string; company: string; text: string; rating: number;
}) {
    return (
        <div className="group relative bg-white rounded-2xl p-7 border border-slate-200/70 overflow-hidden
                       hover:border-blue-200 hover:shadow-[0_24px_60px_-12px_rgba(37,99,235,0.12)]
                       transition-all duration-500 hover:-translate-y-1.5">
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Quote className="h-10 w-10 text-blue-600" />
            </div>
            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
            </div>
            <p className="text-[13.5px] text-slate-600 font-light leading-[1.85] mb-6 relative">
                "{text}"
            </p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-white">{name.charAt(0)}</span>
                </div>
                <div>
                    <div className="font-bold text-[13px] text-slate-900">{name}</div>
                    <div className="text-[11.5px] text-slate-400 font-light">{role} · {company}</div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ContactPage() {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);

    const contactInfo = useReveal(0.08);
    const form = useReveal(0.08);
    const faq = useReveal(0.1);
    const trust = useReveal(0.1);
    const cta = useReveal(0.1);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        department: "sales"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    // ── Lenis smooth scroll + hero parallax ──
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.25,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });

        lenis.on("scroll", (e: { scroll: number }) => {
            const sy = e.scroll;
            if (heroBgRef.current) {
                heroBgRef.current.style.transform = `translateY(${sy * PARALLAX_BG}px)`;
            }
            if (heroContentRef.current) {
                heroContentRef.current.style.transform = `translateY(${sy * PARALLAX_TXT}px)`;
                heroContentRef.current.style.opacity = `${Math.max(1 - sy / HERO_FADE, 0)}`;
            }
        });

        let rafId: number;
        const raf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
        rafId = requestAnimationFrame(raf);
        return () => { lenis.destroy(); cancelAnimationFrame(rafId); };
    }, []);

    const faqs = [
        {
            question: "What is the minimum order quantity?",
            answer: "Minimum order quantities may vary depending on the product category, supplier requirements, and availability. For detailed information about a specific product or order volume, we recommend contacting our sales team."
        },
        {
            question: "Which countries do you export to?",
            answer: "We collaborate with partners across multiple international markets. Our distribution network primarily covers regions such as Europe, the Middle East, Africa, and Central Asia, while opportunities in other markets may also be considered depending on regulatory and logistical conditions."
        },
        {
            question: "Do you handle temperature-controlled products?",
            answer: "Yes. We work with logistics partners that support temperature-controlled transportation when required. Specific temperature ranges and handling procedures may vary depending on the product and shipment conditions."
        },
        {
            question: "Do you provide support with regulatory or market entry processes?",
            answer: "Our team may provide general guidance and coordinate with relevant partners regarding documentation and regulatory considerations in certain markets. The level of support depends on the product, market requirements, and project scope."
        },
        {
            question: "How can I request product quality documentation?",
            answer: "Product documentation such as certificates or quality-related information may be provided upon request, subject to availability and supplier policies. Please contact our team for further assistance."
        },
        {
            question: "How long does it take to receive a quotation?",
            answer: "Quotation timelines may vary depending on product availability, supplier confirmation, and order details. Our team typically reviews inquiries as quickly as possible and will respond once the necessary information is confirmed."
        },
    ];

    const testimonials = [
        {
            name: "Dr. Elif Arslan",
            role: "Supply Chain Manager",
            company: "Public Health Institution",
            text: "Working with Curipharma has been a highly efficient experience. The documentation process was well organized and delivery timelines were handled professionally.",
            rating: 5
        },
        {
            name: "Mehmet Yıldırım",
            role: "Procurement Director",
            company: "MedSupply AG",
            text: "They provided the required documentation for our export processes to Europe in a timely manner. A professional and reliable partner.",
            rating: 5
        },
        {
            name: "Laila Al-Hassan",
            role: "Operations Manager",
            company: "Gulf Pharma Distribution",
            text: "Temperature-controlled logistics were managed smoothly and shipments arrived within the expected timeframes.",
            rating: 5
        },
    ];

    return (
        <>
            <style>{`
                .ct-hero-grid {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 44px 44px;
                }
                .dot-grid-dark  { background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; }
                .dot-grid-light { background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 28px 28px; }

                .noise {
                    position: absolute; inset: 0; pointer-events: none; opacity: 0.028;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                .rv  { transition: opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
                .rh  { opacity: 0; transform: translateY(36px); }
                .rs  { opacity: 1; transform: translateY(0); }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .au-1 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.05s; }
                .au-2 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.18s; }
                .au-3 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.30s; }
                .au-4 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.43s; }

                .shimmer-btn { position: relative; overflow: hidden; }
                .shimmer-btn::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
                    background-size: 200% 100%;
                    animation: ct-shimmer 2.8s ease infinite;
                }
                @keyframes ct-shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                .ct-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
                }

                @keyframes successPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .success-pulse { animation: successPulse 0.5s ease; }
            `}</style>

            <div className="bg-[#f2f4f8] min-h-screen">

                {/* ══════════════════════════════════════
                    1. HERO
                ══════════════════════════════════════ */}
                <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center bg-[#06111e] overflow-hidden">
                    <div ref={heroBgRef} className="absolute inset-0 z-0" style={{ willChange: "transform" }}>
                        <img
                            src="/contacthero.jpg"
                            alt="Contact Us"
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-700/12 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-600/8 rounded-full blur-[80px]" />
                        <div className="absolute inset-0 ct-hero-grid" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06111e]/70 to-[#06111e]" />
                        <div className="noise" />
                    </div>

                    <div ref={heroContentRef} className="relative z-10 max-w-7xl mx-auto px-4 text-center" style={{ willChange: "transform, opacity" }}>
                        <div className="au-1">
                            <SectionLabel centered onDark>Get in Touch</SectionLabel>
                        </div>

                        <h1
                            className="au-2 font-black text-white leading-[1.04] mb-7 tracking-tight"
                            style={{ fontSize: "clamp(2.4rem, 6vw, 4.4rem)" }}
                        >
                            {"Let's Build Something "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Together
                            </span>
                        </h1>

                        <p className="au-3 text-slate-400 text-[16px] md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
                            Whether you need pharmaceutical supply solutions, regulatory guidance, or partnership opportunities — our global team is ready to help.
                        </p>

                        <div className="au-4 flex flex-wrap items-center justify-center gap-3">
                            {[
                                { icon: Mail, text: "info@curipharma.com" },
                                { icon: Phone, text: "+90 212 555 0123" },
                                { icon: Clock, text: "Mon-Fri 9:00-18:00 GMT+3" }
                            ].map(({ icon: Icon, text }) => (
                                <span key={text}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.12] text-[12px] font-medium text-slate-300">
                                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                        <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
                    </div>
                </section>


                {/* ══════════════════════════════════════
                    2. CONTACT INFO CARDS
                ══════════════════════════════════════ */}
                <div ref={contactInfo.ref} className="bg-[#f2f4f8] py-20 -mt-16 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 rv ${contactInfo.v ? "rs" : "rh"}`}>
                            <ContactCard
                                icon={Mail}
                                title="Email Us"
                                lines={["info@curipharma.com", "support@curipharma.com"]}
                                accent="bg-blue-50 text-blue-600"
                            />
                            <ContactCard
                                icon={Phone}
                                title="Call Us"
                                lines={["+90 212 555 0123", "+90 212 555 0124"]}
                                accent="bg-cyan-50 text-cyan-700"
                            />
                            <ContactCard
                                icon={MapPin}
                                title="Visit Us"
                                lines={["Maslak Business Center", "Istanbul, Turkey"]}
                                accent="bg-emerald-50 text-emerald-600"
                            />
                            <ContactCard
                                icon={Clock}
                                title="Working Hours"
                                lines={["Mon-Fri: 9:00-18:00", "Weekend: Closed"]}
                                accent="bg-amber-50 text-amber-600"
                            />
                        </div>
                    </div>
                </div>


                {/* ══════════════════════════════════════
                    3. CONTACT FORM + IMAGE
                ══════════════════════════════════════ */}
                <div ref={form.ref} className="bg-white py-28 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center rv ${form.v ? "rs" : "rh"}`}>
                            {/* Left: Form */}
                            <div>
                                <SectionLabel>Send a Message</SectionLabel>
                                <h2
                                    className="font-black text-slate-900 leading-[1.07] mb-6 tracking-tight"
                                    style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
                                >
                                    How Can We{" "}
                                    <span className="text-blue-600">Help You?</span>
                                </h2>
                                <p className="text-slate-500 text-[15px] font-light leading-[1.85] mb-8">
                                    Fill out the form below and our team will get back to you within 24 business hours.
                                </p>

                                {isSubmitted ? (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center success-pulse">
                                        <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                                        </div>
                                        <h3 className="font-black text-[18px] text-slate-900 mb-2">Message Sent!</h3>
                                        <p className="text-slate-500 text-[14px] font-light">
                                            Thank you for reaching out. We will respond within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formState.name}
                                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                    className="ct-input w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formState.email}
                                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                    className="ct-input w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                                    placeholder="john@company.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                                                    Company
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formState.company}
                                                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                                                    className="ct-input w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                                    placeholder="Company Inc."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                                                    Department
                                                </label>
                                                <select
                                                    value={formState.department}
                                                    onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                                                    className="ct-input w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-900 bg-white transition-all duration-300"
                                                >
                                                    <option value="sales">Sales & Partnerships</option>
                                                    <option value="regulatory">Regulatory Affairs</option>
                                                    <option value="quality">Quality Assurance</option>
                                                    <option value="support">Customer Support</option>
                                                    <option value="general">General Inquiry</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                                                Subject *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formState.subject}
                                                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                                className="ct-input w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                                                Message *
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                className="ct-input w-full px-4 py-3.5 rounded-xl border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 transition-all duration-300 resize-none"
                                                placeholder="Tell us more about your inquiry..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="shimmer-btn inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white px-8 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_8px_28px_rgba(37,99,235,0.28)] hover:shadow-[0_14px_36px_rgba(37,99,235,0.38)] hover:-translate-y-0.5 disabled:hover:translate-y-0"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Right: Image */}
                            <div className="relative">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)]">
                                    <img
                                        src="/contact.jpg"
                                        alt="Contact Support"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                                            <MessageSquare className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Response Time</div>
                                            <div className="text-[17px] font-black text-slate-900">{"< 24 Hours"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
    4. FAQ — light section
══════════════════════════════════════ */}
                <div ref={faq.ref} className="bg-[#f2f4f8] py-28">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start rv ${faq.v ? "rs" : "rh"}`}>

                            {/* Left: Heading */}
                            <div className="lg:sticky lg:top-28 self-start">
                                <SectionLabel>Frequently Asked Questions</SectionLabel>

                                <h2
                                    className="font-black text-slate-900 leading-[1.07] mb-6 tracking-tight"
                                    style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
                                >
                                    Answers to Your{" "}
                                    <span className="text-blue-600">Questions</span>
                                </h2>

                                <p className="text-slate-500 text-[15px] font-light leading-[1.85] mb-8">
                                    We have compiled the most frequently asked questions for you.
                                    If you cannot find the answer you are looking for, feel free to contact us directly —
                                    our team will respond as soon as possible.
                                </p>

                                <a
                                    href="mailto:info@curipharma.com"
                                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Do you have another question?
                                    <ChevronRight className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Right: FAQ list */}
                            <div className="space-y-3">
                                {faqs.map((faqItem, i) => (
                                    <FAQItem key={i} question={faqItem.question} answer={faqItem.answer} />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
    5. TRUST ELEMENTS — dark section
══════════════════════════════════════ */}
                <div ref={trust.ref}>
                    <section className="relative bg-slate-950 py-32 overflow-hidden">
                        <div className="absolute inset-0 dot-grid-dark opacity-30 pointer-events-none" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[400px] bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="noise" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

                            {/* Heading */}
                            <div className={`text-center mb-16 flex flex-col items-center rv ${trust.v ? "rs" : "rh"}`}>
                                <SectionLabel centered onDark>Why Curipharma</SectionLabel>

                                <h2
                                    className="font-black text-white leading-[1.07] tracking-tight mt-1"
                                    style={{ fontSize: "clamp(2rem, 3.8vw, 2.9rem)" }}
                                >
                                    The Values That{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                        Build Trust
                                    </span>
                                </h2>

                                <p className="text-slate-400 text-[15px] font-light leading-[1.85] max-w-xl mx-auto mt-4">
                                    Our partners across international markets choose to work with us for many reasons,
                                    including reliability, transparency, and consistent operational standards.
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-20 rv ${trust.v ? "rs" : "rh"}`}>
                                <TrustBadge icon={ShieldCheck} label="GDP Certified" sub="Cold chain compliant" />
                                <TrustBadge icon={Award} label="ISO 9001" sub="Quality management" />
                                <TrustBadge icon={Globe2} label="50+ Countries" sub="Global distribution network" />
                                <TrustBadge icon={PackageCheck} label="500+ Partners" sub="Active collaborations" />
                                <TrustBadge icon={Truck} label="Fast Response" sub="Efficient communication" />
                                <TrustBadge icon={CheckCircle2} label="GMP Compliant" sub="Manufacturing standards" />
                            </div>

                            {/* Testimonials */}
                            <div className={`rv ${trust.v ? "rs" : "rh"}`}>
                                <div className="text-center mb-10">
                                    <p className="text-[11px] font-black tracking-[0.26em] uppercase text-blue-300">
                                        References
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {testimonials.map((t, i) => (
                                        <TestimonialCard key={i} {...t} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    6. CTA
                ══════════════════════════════════════ */}
                <div ref={cta.ref}>
                    <section className={`relative bg-white py-32 overflow-hidden rv ${cta.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/70 via-white to-white pointer-events-none" />
                        <div className="absolute inset-0 dot-grid-light opacity-20 pointer-events-none" />

                        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
                            <SectionLabel centered>Ready to Start?</SectionLabel>
                            <h2
                                className="font-black text-slate-900 mb-5 mt-2 leading-tight tracking-tight"
                                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                            >
                                Partner with a{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                    Global Leader
                                </span>
                            </h2>
                            <p className="text-slate-500 text-[16.5px] leading-[1.85] max-w-xl mx-auto font-light mb-10">
                                Join healthcare organizations across 50+ markets who trust Curipharma for their pharmaceutical supply needs.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                                <a
                                    href="/quality-policy"
                                    className="shimmer-btn inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_8px_28px_rgba(37,99,235,0.28)] hover:shadow-[0_14px_36px_rgba(37,99,235,0.38)] hover:-translate-y-0.5"
                                >
                                    View Quality Policy
                                    <ArrowRight className="h-4.5 w-4.5" />
                                </a>
                                <a
                                    href="/about"
                                    className="inline-flex items-center gap-2.5 bg-white border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-600 px-10 py-4 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-0.5"
                                >
                                    About Curipharma
                                    <ChevronRight className="h-4.5 w-4.5" />
                                </a>
                            </div>

                            {/* Quick stats */}
                            <div className="border-t border-slate-100 pt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
                                {[
                                    { val: "50+", label: "Countries Served" },
                                    { val: "24h", label: "Response Time" },
                                    { val: "500+", label: "Active Partners" },
                                    { val: "15+", label: "Years Experience" },
                                ].map(({ val, label }) => (
                                    <div key={label} className="text-center">
                                        <div className="text-[28px] font-black text-slate-900 leading-none mb-2">{val}</div>
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.18em]">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </>
    );
}