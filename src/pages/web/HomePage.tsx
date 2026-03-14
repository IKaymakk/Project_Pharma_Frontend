import {
    ArrowRight, ShieldCheck, Globe2, PackageCheck, Snowflake,
    Pill, Building2, TestTubes, Stethoscope, Zap,
    CheckCircle2, ArrowUpRight, Sparkles, Activity, ShieldPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

// ─────────────────────────────────────────────────────────────
// SABİTLER (Magic Numbers Temizlendi)
// ─────────────────────────────────────────────────────────────
const PARALLAX_BG_FACTOR = 0.3;
const PARALLAX_CONTENT_FACTOR = 0.2;
const HERO_FADE_DISTANCE = 600;
const COUNTER_DURATION_MS = 1800;
const MARQUEE_TOP_SPEED = 40;
const MARQUEE_BOTTOM_SPEED = 50;

// ─────────────────────────────────────────────────────────────
// Hook: Scroll Reveal
// ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [v, setV] = useState<boolean>(false);
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
// Hook: Animated Counter (Render ve Memory Leak Optimize)
// ─────────────────────────────────────────────────────────────
function useCounter(target: number, start: boolean): number {
    const [n, setN] = useState<number>(0);
    const prevN = useRef<number>(0);

    useEffect(() => {
        if (!start || isNaN(target)) return;
        let t0: number | undefined;
        let rafId: number;

        const step = (ts: number) => {
            if (t0 === undefined) t0 = ts;
            const p = Math.min((ts - t0) / COUNTER_DURATION_MS, 1);
            const next = Math.floor((1 - Math.pow(1 - p, 3)) * target);

            // Sadece sayı değiştiğinde render tetikle (Performans Fix)
            if (next !== prevN.current) {
                prevN.current = next;
                setN(next);
            }
            if (p < 1) rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId); // Memory Leak Fix
    }, [target, start]);

    return n;
}

// ─────────────────────────────────────────────────────────────
// Component: Infinite Marquee (DOM Optimize)
// ─────────────────────────────────────────────────────────────
interface MarqueeProps { items: React.ReactNode[]; reverse?: boolean; speed?: number; }
function Marquee({ items, reverse = false, speed = 40 }: MarqueeProps) {
    // DOĞRU MATEMATİK: -50% kaydırma için 2 kopya yeterlidir (DOM yükü azaltıldı)
    const cloned = [...items, ...items];
    return (
        <div className="overflow-hidden relative flex">
            <div
                className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}
                style={{ "--spd": `${speed}s` } as React.CSSProperties}
            >
                {cloned.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-8 py-4 border-r border-slate-700/50 text-[12px] font-bold tracking-[.15em] uppercase text-slate-300 whitespace-nowrap"
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Component: StatCard (TypeScript Optimize)
// ─────────────────────────────────────────────────────────────
interface StatCardProps {
    val: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>; // TS Fix
    start: boolean;
}
function StatCard({ val, label, icon: Icon, start }: StatCardProps) {
    const num = parseInt(val.replace(/\D/g, ""), 10);
    const suffix = val.replace(/\d/g, "");
    const count = useCounter(isNaN(num) ? 0 : num, start);

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-10 flex flex-col items-center text-center gap-5 hover:-translate-y-1 transition-transform cursor-default">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Icon className="h-8 w-8 text-amber-300" />
            </div>
            <div className="text-[48px] font-black text-white leading-none drop-shadow-md tabular-nums">
                {isNaN(num) ? val : `${count}${suffix}`}
            </div>
            <div className="text-[13px] text-amber-300 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Component: SectionLabel (Semantik Naming Fix)
// ─────────────────────────────────────────────────────────────
function SectionLabel({ children, centered = false, onDark = false }: { children: React.ReactNode; centered?: boolean; onDark?: boolean; }) {
    return (
        <div className={`inline-flex items-center gap-2 mb-4 ${centered ? "mx-auto justify-center" : ""}`}>
            <span className={`h-px w-8 ${onDark ? "bg-blue-400" : "bg-blue-600"}`} />
            <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${onDark ? "text-blue-300" : "text-blue-600"}`}>
                {children}
            </span>
            {centered && <span className={`h-px w-8 ${onDark ? "bg-blue-400" : "bg-blue-600"}`} />}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Ana Bileşen
// ─────────────────────────────────────────────────────────────
export default function HomePage() {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);
    const orb1Ref = useRef<HTMLDivElement>(null);
    const orb2Ref = useRef<HTMLDivElement>(null);

    // Lenis Scroll & Parallax
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });

        lenis.on("scroll", (e: any) => {
            const scrollY = e.scroll;

            if (heroBgRef.current) {
                heroBgRef.current.style.transform = `translateY(${scrollY * PARALLAX_BG_FACTOR}px)`;
            }
            if (heroContentRef.current) {
                heroContentRef.current.style.transform = `translateY(${scrollY * PARALLAX_CONTENT_FACTOR}px)`;
                heroContentRef.current.style.opacity = `${Math.max(1 - scrollY / HERO_FADE_DISTANCE, 0)}`;
            }
        });

        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // CLEANUP (Memory Leak Fix)
        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);

    const services = useReveal(0.1);
    const clientsSec = useReveal(0.1);
    const globalOps = useReveal(0.2);
    const quality = useReveal(0.1);

    const topMarqueeItems = [
        <><ShieldCheck className="w-4 h-4 text-blue-400" /> GDP Compliant</>,
        <><PackageCheck className="w-4 h-4 text-blue-400" /> ISO 9001:2015</>,
        <><Snowflake className="w-4 h-4 text-blue-400" /> Cold-Chain Verified</>,
        <><PackageCheck className="w-4 h-4 text-blue-400" /> Licensed Wholesaler</>,
        <><CheckCircle2 className="w-4 h-4 text-blue-400" /> GMP Certified</>,
        <><Globe2 className="w-4 h-4 text-blue-400" /> WHO PQ Standards</>,
    ];

    const bottomMarqueeItems = [
        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" /> Public Hospitals</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" /> Private Clinics</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" /> Research Centers</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" /> Licensed Pharmacies</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" /> Regional Distributors</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0" /> Government Agencies</>,
    ];

    return (
        <>
            <style>{`
                html, body {
                    overflow-x: hidden;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    overscroll-behavior-y: none;
                }
                
                /* Font class'ı tutuldu, ancak JSX içi Font Yüklemesi silindi (LCP Fix) */
                .font-body { font-family: 'DM Sans', system-ui, sans-serif; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .anim-1 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.10s; }
                .anim-2 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.25s; }
                .anim-3 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.40s; }
                .anim-4 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.55s; }
                .anim-fade { animation: fadeIn 1.2s ease both 0.2s; }

                /* CSS Naming Collision Fix (mq -> cp-marquee) & Matematik Fix (-50%) */
                @keyframes cp-marquee  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                @keyframes cp-marqueer { from { transform: translateX(-50%); } to { transform: translateX(0); } }
                .animate-marquee     { animation: cp-marquee  var(--spd, 40s) linear infinite; }
                .animate-marquee-rev { animation: cp-marqueer var(--spd, 40s) linear infinite; }
                .animate-marquee:hover, .animate-marquee-rev:hover { animation-play-state: paused; }

                .rv { transition: opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1); }
                .rh { opacity: 0; transform: translateY(40px); }
                .rs { opacity: 1; transform: translateY(0); }

                /* CSS Naming Collision Fix (sh -> cp-shimmer) */
                .shimmer { position: relative; overflow: hidden; }
                .shimmer::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.25) 50%, transparent 65%);
                    background-size: 200% 100%;
                    animation: cp-shimmer 2.8s ease infinite;
                }
                @keyframes cp-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

                .dot-grid { background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 28px 28px; }
                .dot-grid-dark { background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 28px 28px; }
                .diagonal-clip { clip-path: polygon(0 0, 100% 0, 100% 95%, 0 100%); }
                .noise-overlay {
                    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                
                @keyframes cp-spin     { 100% { transform: rotate(360deg);  } }
                @keyframes cp-spin-rev { 100% { transform: rotate(-360deg); } }
                .spin-ring     { animation: cp-spin     20s linear infinite; }
                .spin-ring-rev { animation: cp-spin-rev 25s linear infinite; }

                /* Layer Fix: Scroll performansı için opacity eklendi */
                .hero-content-layer { will-change: transform, opacity; }
            `}</style>

            <div className="font-body flex flex-col min-h-screen bg-slate-50 w-full overflow-clip mt-28">

                {/* ══════════════════════════════════════
                    1. HERO
                ══════════════════════════════════════ */}
                <section className="relative min-h-[90vh] md:min-h-[100vh] flex flex-col items-center justify-center diagonal-clip pt-32 pb-[15vh]">

                    <div ref={heroBgRef} className="absolute inset-0 z-0 anim-fade will-change-transform">
                        <div
                            className="absolute inset-0 w-full h-[120%] -top-[10%]"
                            style={{
                                backgroundImage: "url('https://i.hizliresim.com/ke9lr02.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center top",
                            }}
                        />
                        <div className="absolute inset-0 bg-[#071525]/85 backdrop-blur-[1px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071525] via-transparent to-transparent opacity-90" />
                        <div className="absolute inset-0 dot-grid opacity-40" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />
                    </div>

                    <div
                        ref={heroContentRef}
                        className="hero-content-layer relative z-10 max-w-5xl mx-auto px-4 w-full flex flex-col items-center text-center -mt-40 md:-mt-40"
                    >
                        <div className="anim-1 relative group inline-flex mb-8 cursor-default">
                            <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 blur-[0px] opacity-40 animate-pulse transition duration-1000"></div>
                            <div className="relative flex items-center gap-2.5 px-6 py-2 rounded-full border border-blue-400/10 bg-white/5 backdrop-blur-md">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/70"></span>
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
                                </span>
                                <span className="text-[9.5px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-slate-300">
                                    Premier Pharmaceutical Wholesaler
                                </span>
                            </div>
                        </div>

                        <h1
                            className="font-black anim-2 text-white leading-[1.05] mb-6 drop-shadow-2xl"
                            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}

                        >
                            Leading the Future of{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    Global Pharma
                                </span>
                                <span className="absolute -bottom-2 left-0 right-0 h-[4px] bg-blue-500/30 rounded-full blur-[2px]" />
                            </span>
                            {" "}Distribution
                        </h1>

                        <p className="anim-3 text-slate-400 text-[16px] md:text-[18px] leading-relaxed mb-10 max-w-3xl font-light drop-shadow-md">
                            We integrate procurement, agency services, customs clearance, and distribution into a seamless
                            one-stop solution.{" "}
                            <strong className="text-white font-medium">GMP & GDP certified</strong> for absolute reliability.
                        </p>

                        <div className="anim-4 flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
                            <Link
                                to="/products"
                                aria-label="View our product catalog"
                                className="shimmer w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-9 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:-translate-y-1"
                            >
                                View Product Catalog
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/contact"
                                aria-label="Contact us for partnership"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/25 px-9 py-4 rounded-xl text-[15px] font-semibold transition-all backdrop-blur-md hover:-translate-y-1"
                            >
                                Partner With Us
                                <ArrowRight className="h-5 w-5 text-slate-400" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    2. DOUBLE MARQUEE
                ══════════════════════════════════════ */}
                <section className="relative z-20 -mt-[50px] px-2 sm:px-4 max-w-[100rem] mx-auto w-full">
                    <div className="bg-slate-900 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#07111f] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#07111f] to-transparent z-10 pointer-events-none" />
                        <Marquee items={topMarqueeItems} speed={MARQUEE_TOP_SPEED} />
                        <div className="border-t border-white/5" />
                        <Marquee items={bottomMarqueeItems} reverse speed={MARQUEE_BOTTOM_SPEED} />
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    3. SERVICES (Dark Pattern Fix - 3 Kart da Tıklanabilir)
                ══════════════════════════════════════ */}
                <div ref={services.ref}>
                    <section className={`bg-slate-50 relative pt-32 pb-32 border-b border-slate-200 rv ${services.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 dot-grid-dark opacity-30" />
                        <div className="relative max-w-7xl mx-auto px-4 md:px-8">

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                                <div className="max-w-2xl">
                                    <SectionLabel>Our Solutions</SectionLabel>
                                    <h2
                                        className="font-black text-slate-900 leading-[1.1] mt-2"
                                        style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
                                    >
                                        Engineered for Healthcare Excellence
                                    </h2>
                                </div>
                                <p className="text-slate-500 text-[16px] leading-relaxed max-w-md font-light pb-2">
                                    The pharmaceutical industry demands precision. Our service pillars ensure life-saving treatments
                                    reach patients safely, on time, and without compromise.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                                <Link
                                    to="/products"
                                    aria-label="View Brand Name Medicinals"
                                    className="md:col-span-7 group relative bg-white rounded-[2rem] p-10 overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] transition-all duration-300 flex flex-col justify-between min-h-[400px]"
                                >
                                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700" />
                                    <div className="relative z-10 flex items-start justify-between mb-16">
                                        <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <ShieldPlus className="h-7 w-7" />
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full">Brand Name</span>
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="font-black text-[28px] text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Original Medicinals</h4>
                                        <p className="text-slate-500 text-[16px] leading-relaxed max-w-md font-light">
                                            Long-term strategic partnerships with leading manufacturers in Europe, the US, and Japan.
                                            We guarantee 100% authentic, high-quality products direct from the source.
                                        </p>
                                    </div>
                                    <ArrowUpRight className="absolute bottom-10 right-10 h-8 w-8 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                </Link>

                                <Link
                                    to="/products"
                                    aria-label="View Generic Drugs"
                                    className="md:col-span-5 group relative bg-slate-900 rounded-[2rem] p-10 overflow-hidden border border-slate-800 hover:border-cyan-500/30 hover:shadow-[0_20px_40px_-15px_rgba(34,211,238,0.12)] transition-all duration-300 flex flex-col justify-between min-h-[400px]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative z-10 flex items-start justify-between mb-16">
                                        <div className="h-14 w-14 rounded-2xl bg-white/10 text-cyan-400 flex items-center justify-center backdrop-blur-md border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                            <Pill className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="font-black text-[24px] text-white mb-3 group-hover:text-cyan-400 transition-colors">Generic Drugs</h4>
                                        <p className="text-slate-400 text-[15px] leading-relaxed font-light">
                                            Affordable, high-quality pharmaceutical solutions bridging the gap between medical
                                            innovation and global patient access.
                                        </p>
                                    </div>
                                    <ArrowUpRight className="absolute bottom-10 right-10 h-8 w-8 text-slate-700 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                </Link>

                                <Link
                                    to="/products"
                                    aria-label="View Specialty Supplies"
                                    className="md:col-span-12 group relative bg-white rounded-[2rem] p-10 overflow-hidden border border-slate-200 hover:border-blue-200 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.08)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-10"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Activity className="h-6 w-6" />
                                            </div>
                                            <span className="bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-blue-100">Specialty</span>
                                        </div>
                                        <h4 className="font-black text-[24px] text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Advanced Medical Supplies & Oncology</h4>
                                        <p className="text-slate-500 text-[16px] leading-relaxed max-w-2xl font-light">
                                            A comprehensive portfolio of innovative, specialty, and rare medications. We provide
                                            specialized cold-chain logistics tailored for Oncology, Rare Diseases, and Critical Chronic Care.
                                        </p>
                                    </div>
                                    <div className="shrink-0 w-full md:w-auto flex justify-end">
                                        <div className="h-16 w-16 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 text-slate-400">
                                            <ArrowRight className="h-6 w-6" />
                                        </div>
                                    </div>
                                </Link>

                            </div>
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    4. WHO WE SERVE (Sticky Scroll)
                ══════════════════════════════════════ */}
                <div ref={clientsSec.ref}>
                    <section className={`bg-white py-32 border-b border-slate-100 overflow-visible relative rv ${clientsSec.v ? "rs" : "rh"}`}>
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="relative flex flex-col lg:flex-row items-start gap-16 lg:gap-24">

                                <div className="lg:w-5/12 lg:sticky lg:top-40 pt-4">
                                    <SectionLabel>Global Network</SectionLabel>
                                    <h2
                                        className="font-black text-slate-900 mb-6 leading-[1.1]"
                                        style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}
                                    >
                                        A Vital Link in{" "}
                                        <span className="text-blue-600">Global Healthcare</span>
                                    </h2>
                                    <p className="text-slate-500 text-[16px] leading-relaxed mb-8 font-light">
                                        Our operations span international markets, serving a diverse clientele. We maintain rigorous
                                        oversight to ensure patient safety and product efficacy at every step of the supply chain.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "International GMP & GDP standards",
                                            "Cold-chain logistics expertise",
                                            "24/7 customs operations support",
                                            "Supply capacity in 50+ countries",
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-4 text-[15px] text-slate-700 font-medium">
                                                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                    {[
                                        { icon: Building2, title: "Public Hospitals", sub: "Large scale institutional supply", color: "from-blue-500 to-cyan-400" },
                                        { icon: TestTubes, title: "Research Inst.", sub: "Clinical R&D and lab supply", color: "from-purple-500 to-blue-400" },
                                        { icon: Stethoscope, title: "Private Clinics", sub: "Specialized private care networks", color: "from-emerald-500 to-teal-400" },
                                        { icon: Globe2, title: "Distributors", sub: "Regional B2B wholesale network", color: "from-orange-500 to-amber-400" },
                                        { icon: Pill, title: "Pharmacies", sub: "Verified retail pharmacy chains", color: "from-pink-500 to-rose-400" },
                                        { icon: Sparkles, title: "NGOs", sub: "Global health organizations", color: "from-indigo-500 to-blue-500" },
                                    ].map(({ icon: Icon, title, sub, color }, idx) => (
                                        <div
                                            key={title}
                                            className={`group relative bg-slate-50 border border-transparent rounded-[2rem] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-slate-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:bg-white ${idx % 2 !== 0 ? "sm:mt-12" : ""}`}
                                        >
                                            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-[2rem]`} />
                                            <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-[20px] font-black text-slate-900 leading-tight mb-2">{title}</h3>
                                            <p className="text-[14px] text-slate-500 font-medium">{sub}</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    5. GLOBAL LOGISTICS
                ══════════════════════════════════════ */}
                <div ref={globalOps.ref}>
                    <section className="relative bg-[#060f1c] py-32 overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-[0.18] pointer-events-none"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        <div className="noise-overlay" />
                        <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                        <div ref={orb1Ref} className="absolute left-[8%] top-[20%] w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none will-change-transform" />
                        <div ref={orb2Ref} className="absolute right-[8%] bottom-[20%] w-52 h-52 bg-amber-600/10 blur-[80px] rounded-full pointer-events-none will-change-transform" />

                        <div className="absolute left-[-2%] lg:left-[4%] top-1/2 -translate-y-1/2 w-72 h-72 hidden md:block pointer-events-none opacity-60">
                            <div className="absolute inset-0 border-[1.5px] border-dashed border-blue-400/50 rounded-full" />
                            <div className=" absolute inset-8 border-[1.5px] border-dotted border-cyan-300/60 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]" />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className={`text-center mb-16 flex flex-col items-center rv ${globalOps.v ? "rs" : "rh"}`}>
                                <SectionLabel centered onDark>Global Operations</SectionLabel>
                                <h2
                                    className="font-extrabold text-white mt-2 mb-4"
                                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                                >
                                    Global Pharmaceutical Logistics
                                </h2>
                                <p className="text-slate-400 max-w-2xl mx-auto text-[16px] leading-relaxed font-light">
                                    Navigating complex international regulations and customs procedures. Our strategic supply routes
                                    connect{" "}
                                    <span className="text-blue-400 font-semibold">Europe, Asia, and the Americas</span>{" "}
                                    with flawless execution.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {[
                                    { val: "50+", label: "Countries Served", icon: Globe2 },
                                    { val: "100%", label: "Cold-Chain Integrity", icon: Snowflake },
                                    { val: "24/7", label: "Customs Support", icon: Zap },
                                ].map(({ val, label, icon }, i) => (
                                    <div
                                        key={label}
                                        className={`rv ${globalOps.v ? "rs" : "rh"}`}
                                        style={{ transitionDelay: `${i * 120}ms` }}
                                    >
                                        <StatCard val={val} label={label} icon={icon} start={globalOps.v} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    6. QUALITY & CTA
                ══════════════════════════════════════ */}
                <div ref={quality.ref}>
                    <section className={`relative bg-white py-32 overflow-hidden border-t border-slate-200 rv ${quality.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white pointer-events-none" />
                        <div className="absolute inset-0 dot-grid-dark opacity-10" />

                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <div className="mb-20">
                                <SectionLabel centered>Ready to Scale</SectionLabel>
                                <h2
                                    className="font-black text-slate-900 mb-6 mt-4 leading-tight"
                                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                                >
                                    Elevate Your{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                        Supply Chain
                                    </span>
                                </h2>
                                <p className="text-slate-500 text-[18px] leading-relaxed max-w-2xl mx-auto font-light mb-10">
                                    Join hundreds of healthcare institutions worldwide who trust our certified, reliable, and
                                    temperature-controlled pharmaceutical distribution.
                                </p>
                                <Link
                                    to="/contact"
                                    aria-label="Start sourcing smarter by contacting us"
                                    className="shimmer inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl text-[16px] font-bold transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                                >
                                    Start Sourcing Smarter
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>

                            <div className="border-t border-slate-100 pt-16">
                                <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-8">
                                    Internationally Certified & Compliant
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { code: "GDP Certified", desc: "Good Distribution" },
                                        { code: "Wholesale License", desc: "Authorized Dist." },
                                        { code: "ISO 9001:2015", desc: "Quality Management" },
                                        { code: "GMP Compliant", desc: "Manufacturing Stds." },
                                    ].map(({ code, desc }, idx) => (
                                        <div
                                            key={idx}
                                            className="group bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white hover:border-blue-200 hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.12)] transition-all duration-300"
                                        >
                                            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <ShieldCheck className="h-7 w-7 text-blue-600" />
                                            </div>
                                            <div className="text-[15px] font-extrabold text-slate-900 mb-1">{code}</div>
                                            <div className="text-[13px] text-slate-500 font-medium">{desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </>
    );
}