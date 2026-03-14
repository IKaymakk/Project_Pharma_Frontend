import { useEffect, useRef, useState } from "react";
import {
    ShieldCheck, Award, FlaskConical, Thermometer,
    FileCheck2, RefreshCw, Users, ChevronRight,
    ArrowRight, CheckCircle2, Globe2, ClipboardList,
    TrendingUp, Microscope, PackageCheck, AlertCircle
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
// Pillar Card
// ─────────────────────────────────────────────────────────────
function PillarCard({ icon: Icon, number, title, desc, accent, delay }: {
    icon: React.ComponentType<{ className?: string }>;
    number: string; title: string; desc: string;
    accent: string; delay: number;
}) {
    return (
        <div
            className="qp-pillar group relative bg-white rounded-[1.5rem] p-8 border border-slate-200/70 overflow-hidden
                       hover:border-blue-200 hover:shadow-[0_24px_60px_-12px_rgba(37,99,235,0.13)]
                       transition-all duration-500 hover:-translate-y-2"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-3 -right-1 text-[88px] font-black text-slate-100 leading-none select-none pointer-events-none group-hover:text-blue-50 transition-colors duration-500">
                {number}
            </div>
            <div className="relative">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 ${accent} transition-transform duration-500 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-black text-[16px] text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {title}
                </h3>
                <p className="text-[13.5px] text-slate-500 leading-[1.78] font-light">{desc}</p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Commitment Row
// ─────────────────────────────────────────────────────────────
function CommitmentRow({ icon: Icon, title, desc }: {
    icon: React.ComponentType<{ className?: string }>; title: string; desc: string;
}) {
    return (
        <div className="group flex items-start gap-5 py-5 border-b border-slate-100 last:border-0
                        hover:bg-blue-50/30 -mx-6 px-6 rounded-xl transition-colors duration-300">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                <Icon className="h-4.5 w-4.5 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
                <div className="font-black text-[14px] text-slate-900 mb-1">{title}</div>
                <div className="text-[13px] text-slate-500 font-light leading-relaxed">{desc}</div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Cert Badge
// ─────────────────────────────────────────────────────────────
function CertBadge({ code, body, scope }: { code: string; body: string; scope: string }) {
    return (
        <div className="group flex flex-col items-center text-center bg-white/[0.04] border border-white/[0.09]
                        rounded-2xl p-6 hover:bg-white/[0.08] hover:border-blue-400/30
                        transition-all duration-300 hover:-translate-y-1">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/30
                            border border-blue-400/30 flex items-center justify-center mb-4
                            group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                <ShieldCheck className="h-6 w-6 text-blue-300" />
            </div>
            <div className="text-[15px] font-black text-white mb-1">{code}</div>
            <div className="text-[11px] text-blue-300 font-bold tracking-wide mb-2">{body}</div>
            <div className="text-[11px] text-slate-500 font-medium leading-snug">{scope}</div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Image Feature Card
// ─────────────────────────────────────────────────────────────
function ImageFeatureCard({
    image,
    title,
    desc,
    tag,
    reverse = false
}: {
    image: string;
    title: string;
    desc: string;
    tag: string;
    reverse?: boolean;
}) {
    const reveal = useReveal(0.1);
    return (
        <div ref={reveal.ref} className={`rv ${reveal.v ? "rs" : "rh"}`}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
                <div className={`relative ${reverse ? "lg:order-2" : ""}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.15)]">
                        <img
                            src={image}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -bottom-4 -right-4 lg:-right-6 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-[0_12px_40px_rgba(37,99,235,0.35)]">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-0.5">{tag}</div>
                        <div className="text-[15px] font-black">Certified</div>
                    </div>
                </div>
                <div className={reverse ? "lg:order-1" : ""}>
                    <h3 className="font-black text-slate-900 mb-4 leading-tight" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
                        {title}
                    </h3>
                    <p className="text-slate-500 text-[15px] leading-[1.85] font-light mb-6">
                        {desc}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-[14px] group cursor-pointer">
                        Learn more
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function QualityPolicyPage() {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);

    const pillars = useReveal(0.08);
    const imageFeatures = useReveal(0.08);
    const statement = useReveal(0.1);
    const commitments = useReveal(0.1);
    const certs = useReveal(0.1);
    const cta = useReveal(0.1);

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

    return (
        <>
            <style>{`
                /* ── Hero grid ── */
                .qp-hero-grid {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 44px 44px;
                }
                .dot-grid-dark  { background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; }
                .dot-grid-light { background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 28px 28px; }

                /* ── Noise ── */
                .noise {
                    position: absolute; inset: 0; pointer-events: none; opacity: 0.028;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                /* ── Reveal ── */
                .rv  { transition: opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1); }
                .rh  { opacity: 0; transform: translateY(36px); }
                .rs  { opacity: 1; transform: translateY(0); }

                /* ── Hero entrance ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(22px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .au-1 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.05s; }
                .au-2 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.18s; }
                .au-3 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.30s; }
                .au-4 { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both 0.43s; }

                /* ── Pillar cards staggered entrance ── */
                @keyframes cardUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .qp-pillar { animation: cardUp 0.6s cubic-bezier(.16,1,.3,1) both; }

                /* ── Shimmer CTA ── */
                .shimmer-btn { position: relative; overflow: hidden; }
                .shimmer-btn::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
                    background-size: 200% 100%;
                    animation: cp-shimmer 2.8s ease infinite;
                }
                @keyframes cp-shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                /* ── Policy statement quote line ── */
                .qp-quote-line {
                    position: relative;
                    padding-left: 24px;
                }
                .qp-quote-line::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(to bottom, #3b82f6, #06b6d4);
                    border-radius: 99px;
                }

                /* ── Diagonal clip ── */
                .diagonal-bottom { clip-path: polygon(0 0, 100% 0, 100% 94%, 0 100%); }
            `}</style>

            <div className="bg-[#f2f4f8] min-h-screen">

                {/* ══════════════════════════════════════
                    1. HERO
                ══════════════════════════════════════ */}
                <section className="relative h-[100vh] flex flex-col items-center justify-center bg-[#06111e] overflow-hidden">
                    <div ref={heroBgRef} className="absolute inset-0 z-0" style={{ willChange: "transform" }}>
                        {/* Hero background image */}
                        <img
                            src="/qualityhero.png"
                            alt="Quality Control Laboratory"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                        {/* Subtle radial glow */}
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-700/12 rounded-full blur-[120px]" />
                        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-600/8 rounded-full blur-[80px]" />
                        <div className="absolute inset-0 qp-hero-grid" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06111e]/70 to-[#06111e]" />
                        <div className="noise" />
                    </div>

                    <div ref={heroContentRef} className="relative z-10 max-w-7xl mx-auto px-4 text-center" style={{ willChange: "transform, opacity" }}>
                        <div className="au-1">
                            <SectionLabel centered onDark>ISO 9001:2015 · GDP · GMP</SectionLabel>
                        </div>

                        <h1
                            className="au-2 font-black text-white leading-[1.04] mb-7 tracking-tight"
                            style={{ fontSize: "clamp(2.6rem, 6.5vw, 4.4rem)" }}
                        >
                            Quality is Not a{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Department.
                            </span>
                            <br />
                            <span className="text-white/70 font-light" style={{ fontSize: "clamp(1.6rem, 4vw, 3rem)" }}>
                                {"It's our entire operation."}
                            </span>
                        </h1>

                        <p className="au-3 text-slate-400 text-[16px] md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
                            {"Curipharma's quality management system governs every stage of our supply chain — from manufacturer qualification to cold-chain last-mile delivery."}
                        </p>

                        {/* Cert pills */}
                        <div className="au-4 flex flex-wrap items-center justify-center gap-3">
                            {["GDP Certified", "GMP Compliant", "ISO 9001:2015", "WHO PQ-Aligned", "Cold-Chain GDP"].map(cert => (
                                <span key={cert}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-[11px] font-bold text-slate-300 tracking-wide">
                                    <ShieldCheck className="h-3 w-3 text-blue-400" />
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
                        <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
                    </div>
                </section>


                {/* ══════════════════════════════════════
                    2. QUALITY PILLARS — bento grid
                ══════════════════════════════════════ */}
                <div ref={pillars.ref} className="bg-[#f2f4f8] py-28">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className={`text-center mb-16 flex flex-col items-center rv ${pillars.v ? "rs" : "rh"}`}>
                            <SectionLabel centered>Quality Pillars</SectionLabel>
                            <h2
                                className="font-black text-slate-900 leading-[1.07] tracking-tight mt-1"
                                style={{ fontSize: "clamp(2rem, 3.8vw, 2.9rem)" }}
                            >
                                Six Pillars of{" "}
                                <span className="text-blue-600">Uncompromised Quality</span>
                            </h2>
                        </div>

                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 rv ${pillars.v ? "rs" : "rh"}`}>
                            <PillarCard number="01" icon={Award} title="Supplier Qualification"
                                desc="Every manufacturer in our network undergoes rigorous auditing against GMP standards before a single SKU enters our catalog. We re-qualify annually."
                                accent="bg-blue-50 text-blue-600" delay={0} />
                            <PillarCard number="02" icon={FlaskConical} title="Product Integrity Assurance"
                                desc="Batch documentation, CoA verification, and pharmacopoeial cross-checking are mandatory for every product we handle. No exceptions."
                                accent="bg-cyan-50 text-cyan-700" delay={80} />
                            <PillarCard number="03" icon={Thermometer} title="Cold-Chain Control"
                                desc="Temperature-sensitive products are managed under continuous monitoring protocols from origin warehouse to final delivery point, with full data loggers."
                                accent="bg-indigo-50 text-indigo-600" delay={160} />
                            <PillarCard number="04" icon={FileCheck2} title="Regulatory Compliance"
                                desc="We maintain market-specific import dossiers, licensed distribution routes, and customs compliance documentation across all 50+ markets we serve."
                                accent="bg-emerald-50 text-emerald-600" delay={240} />
                            <PillarCard number="05" icon={RefreshCw} title="Continuous Improvement"
                                desc="Our ISO 9001:2015-certified QMS includes regular CAPA cycles, internal audits, and supplier performance reviews to drive ongoing system improvement."
                                accent="bg-amber-50 text-amber-600" delay={320} />
                            <PillarCard number="06" icon={Users} title="Staff Competency"
                                desc="All logistics, regulatory, and quality personnel undergo certified training. GDP awareness is embedded as a core competency across every team."
                                accent="bg-rose-50 text-rose-600" delay={400} />
                        </div>
                    </div>
                </div>


                {/* ══════════════════════════════════════
                    2.5. IMAGE FEATURES SECTION
                ══════════════════════════════════════ */}
                <div ref={imageFeatures.ref} className="bg-white py-28 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-28">
                        <ImageFeatureCard
                            image="/qualitiyimage1.png"
                            title="State of the Art Cold-Chain Infrastructure"
                            desc="Our temperature-controlled warehouses maintain strict 2-8°C and -20°C zones with real-time monitoring. Every shipment is tracked from origin to destination with IoT-enabled data loggers ensuring complete chain of custody documentation."
                            tag="GDP"
                        />
                        <ImageFeatureCard
                            image="/quality2.png"
                            title="Expert Quality Assurance Team"
                            desc="Our Qualified Persons (QPs) and quality specialists bring decades of combined experience in pharmaceutical distribution. Each team member is trained annually on GDP requirements and operates independently from commercial pressures."
                            tag="ISO 9001"
                            reverse
                        />
                        <ImageFeatureCard
                            image="/quality3.png"
                            title="Global Distribution Network"
                            desc="Operating across 50+ regulated markets, we maintain market-specific compliance documentation and licensed distribution routes. Our logistics partners are GDP-certified and audited annually to ensure consistent quality standards worldwide."
                            tag="WHO PQ"
                        />
                    </div>
                </div>


                {/* ══════════════════════════════════════
                    3. POLICY STATEMENT — dark split
                ══════════════════════════════════════ */}
                <div ref={statement.ref}>
                    <section className={`relative bg-slate-950 py-32 overflow-hidden diagonal-bottom rv ${statement.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 dot-grid-dark opacity-30 pointer-events-none" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[400px] bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="noise" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                                {/* Left: Statement text */}
                                <div>
                                    <SectionLabel onDark>Official Policy Statement</SectionLabel>
                                    <h2
                                        className="font-black text-white leading-[1.07] mb-8 tracking-tight"
                                        style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
                                    >
                                        Our Commitment to{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                            Every Stakeholder
                                        </span>
                                    </h2>

                                    <div className="space-y-5 text-slate-400 text-[15px] font-light leading-[1.85]">
                                        <p className="qp-quote-line">
                                            Curipharma is committed to supplying only pharmaceutical products
                                            that meet the highest standards of quality, safety, and efficacy
                                            as defined by international regulatory authorities.
                                        </p>
                                        <p>
                                            We operate a fully documented Quality Management System aligned
                                            with ISO 9001:2015, EU Good Distribution Practice guidelines, and
                                            WHO-PQ requirements. Our quality objectives are reviewed at every
                                            management review cycle.
                                        </p>
                                        <p>
                                            Every employee, partner, and contracted logistics provider is bound
                                            by our quality obligations. We do not compromise on product integrity
                                            regardless of commercial pressure, timeline constraints, or market conditions.
                                        </p>
                                    </div>

                                    <div className="mt-10 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                                            <TrendingUp className="h-4.5 w-4.5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-white font-black text-[14px]">Management Commitment</div>
                                            <div className="text-slate-500 text-[12px] font-light">Reviewed & reaffirmed annually at board level</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: KPI cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { val: "100%", label: "Batch Traceability", sub: "From manufacturer to patient" },
                                        { val: "0", label: "GDP Deviations", sub: "Cold-chain incidents YTD" },
                                        { val: "99%", label: "On-Time Rate", sub: "Temperature-controlled routes" },
                                        { val: "24h", label: "CAPA Response", sub: "Quality event resolution target" },
                                    ].map(({ val, label, sub }) => (
                                        <div key={label}
                                            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6
                                                       hover:bg-white/[0.07] hover:border-blue-400/20
                                                       transition-all duration-300 hover:-translate-y-1">
                                            <div className="text-[32px] font-black text-white leading-none mb-2 tabular-nums">{val}</div>
                                            <div className="text-[11px] font-black text-blue-400 uppercase tracking-[0.18em] mb-1">{label}</div>
                                            <div className="text-[12px] text-slate-500 font-medium">{sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>


                {/* ══════════════════════════════════════
                    4. COMMITMENTS — white section
                ══════════════════════════════════════ */}
                <div ref={commitments.ref}>
                    <section className={`relative bg-white py-32 border-b border-slate-100 rv ${commitments.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 dot-grid-light opacity-30 pointer-events-none" />
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                                {/* Left: Sticky heading */}
                                <div className="lg:sticky lg:top-28 self-start">
                                    <SectionLabel>Quality Commitments</SectionLabel>
                                    <h2
                                        className="font-black text-slate-900 leading-[1.07] mb-6 tracking-tight"
                                        style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
                                    >
                                        What We Guarantee{" "}
                                        <span className="text-blue-600">At Every Step</span>
                                    </h2>
                                    <p className="text-slate-500 text-[15.5px] font-light leading-[1.85] mb-8">
                                        These are not aspirational targets — they are operational requirements
                                        embedded in every process, contract, and partnership we manage.
                                    </p>

                                    {/* Accent card with image */}
                                    <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-7 text-white overflow-hidden">
                                        <div className="absolute inset-0 opacity-10">
                                            <img
                                                src="/images/quality-lab.jpg"
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 mb-3">
                                                Document Reference
                                            </div>
                                            <div className="font-black text-[17px] mb-2">QMS-POL-001 Rev. 6</div>
                                            <div className="text-blue-200 text-[13px] font-light leading-relaxed mb-4">
                                                This policy is maintained under our ISO 9001:2015 certified Quality Management System and subject to annual management review.
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] font-bold text-blue-100">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />
                                                Last reviewed: Q4 2024
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Commitment list */}
                                <div>
                                    <CommitmentRow icon={Microscope} title="Source Only from Qualified Manufacturers"
                                        desc="All suppliers must hold valid GMP certificates and pass our internal qualification audit before onboarding." />
                                    <CommitmentRow icon={ClipboardList} title="Maintain Complete Documentation"
                                        desc="Every transaction is supported by CoA, batch records, and regulatory import documentation. Zero undocumented shipments." />
                                    <CommitmentRow icon={Thermometer} title="Protect Product Integrity in Transit"
                                        desc="Temperature excursions trigger automatic quarantine and investigation. No compromised products reach our customers." />
                                    <CommitmentRow icon={Globe2} title="Comply with All Applicable Regulations"
                                        desc="We monitor regulatory changes across all 50+ markets and update our processes within 30 days of any material change." />
                                    <CommitmentRow icon={AlertCircle} title="Report & Resolve Quality Events Promptly"
                                        desc="CAPA initiation within 24 hours of any quality event. Root cause and corrective action documented within 15 working days." />
                                    <CommitmentRow icon={PackageCheck} title="Never Release Unapproved Products"
                                        desc="Qualified Person sign-off is mandatory for every release. Our QP team operates independently of commercial pressure." />
                                    <CommitmentRow icon={RefreshCw} title="Continually Improve Our QMS"
                                        desc="Bi-annual internal audits, annual management reviews, and ongoing KPI monitoring drive systemic improvements." />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>


                {/* ══════════════════════════════════════
                    5. CERTIFICATIONS — dark section
                ══════════════════════════════════════ */}
                <div ref={certs.ref}>
                    <section className="relative bg-[#060f1c] py-32 overflow-hidden">
                        <div className="absolute inset-0 dot-grid-dark opacity-35 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-600/6 rounded-full blur-[120px] pointer-events-none" />
                        <div className="noise" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className={`text-center mb-16 flex flex-col items-center rv ${certs.v ? "rs" : "rh"}`}>
                                <SectionLabel centered onDark>Accreditations</SectionLabel>
                                <h2
                                    className="font-black text-white mt-1 mb-4 tracking-tight"
                                    style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
                                >
                                    Internally Certified
                                </h2>
                                <p className="text-slate-400 text-[15px] font-light leading-[1.85] max-w-xl">
                                    Our quality infrastructure is validated by the certifications and standards
                                    that matter most to our customers and regulators.
                                </p>
                            </div>

                            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 rv ${certs.v ? "rs" : "rh"}`}>
                                <CertBadge code="ISO 9001:2015" body="TÜV Rheinland" scope="Quality Management System" />
                                <CertBadge code="EU GDP" body="National Regulator" scope="Good Distribution Practice" />
                                <CertBadge code="GMP Compliant" body="Agency Operations" scope="Manufacturing Standards" />
                                <CertBadge code="WHO PQ" body="Aligned" scope="Pre-qualification Supply" />
                                <CertBadge code="Cold-Chain GDP" body="IATA/INAHTA" scope="Temperature-Controlled Logistics" />
                            </div>

                            {/* Bottom strip */}
                            <div className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 rv ${certs.v ? "rs" : "rh"}`}>
                                {[
                                    { icon: FileCheck2, label: "Annual Re-certification", desc: "All certifications are maintained on active renewal schedules with zero lapses since inception." },
                                    { icon: Award, label: "Third-Party Audited", desc: "External audit bodies conduct unannounced inspections across our warehouse and logistics operations." },
                                    { icon: Globe2, label: "Market-Specific Compliance", desc: "We maintain separate regulatory documentation for each jurisdiction in our 50+ country network." },
                                ].map(({ icon: Icon, label, desc }) => (
                                    <div key={label} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] transition-colors duration-300">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500/12 border border-blue-500/18 flex items-center justify-center shrink-0">
                                            <Icon className="h-4.5 w-4.5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-[13.5px] mb-1">{label}</div>
                                            <div className="text-slate-500 text-[12.5px] font-light leading-relaxed">{desc}</div>
                                        </div>
                                    </div>
                                ))}
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
                            <SectionLabel centered>Work With Us</SectionLabel>
                            <h2
                                className="font-black text-slate-900 mb-5 mt-2 leading-tight tracking-tight"
                                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                            >
                                Quality Documentation{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                    Available on Request
                                </span>
                            </h2>
                            <p className="text-slate-500 text-[16.5px] leading-[1.85] max-w-xl mx-auto font-light mb-10">
                                Regulatory teams, procurement managers, and QA directors can request
                                our full certificate pack, audit summaries, and QMS documentation.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                                <a
                                    href="/contact"
                                    className="shimmer-btn inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_8px_28px_rgba(37,99,235,0.28)] hover:shadow-[0_14px_36px_rgba(37,99,235,0.38)] hover:-translate-y-0.5"
                                >
                                    Request Documentation
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

                            {/* Quick fact strip */}
                            <div className="border-t border-slate-100 pt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
                                {[
                                    { val: "15+", label: "Years QMS Operation" },
                                    { val: "50+", label: "Regulated Markets" },
                                    { val: "5", label: "Active Certifications" },
                                    { val: "0", label: "Unresolved CAPA Items" },
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