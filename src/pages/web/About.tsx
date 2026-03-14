import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, ShieldCheck, Globe2, Snowflake,
    CheckCircle2, Award, Users,
    TrendingUp, Heart, Zap, Lock, ChevronRight,
    Target, Cpu
} from "lucide-react";
import Lenis from "lenis";

const PARALLAX_BG = 0.32;
const PARALLAX_TXT = 0.14;
const HERO_FADE = 750;

function useReveal(threshold = 0.12) {
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

function useCounter(target: number, active: boolean, duration = 1600): number {
    const [n, setN] = useState(0);
    const frameRef = useRef<number>(0);
    useEffect(() => {
        if (!active || isNaN(target)) return;
        let t0: number | undefined;
        const step = (ts: number) => {
            if (t0 === undefined) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) frameRef.current = requestAnimationFrame(step);
        };
        frameRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameRef.current);
    }, [target, active, duration]);
    return n;
}

function StatCounter({ val, label, sublabel, active }: {
    val: string; label: string; sublabel: string; active: boolean;
}) {
    const num = parseInt(val.replace(/\D/g, ""), 10);
    const suffix = val.replace(/[0-9]/g, "");
    const count = useCounter(isNaN(num) ? 0 : num, active);
    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left px-8 py-10 relative group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
            <div className="text-[40px] font-black text-white tabular-nums leading-none mb-2 tracking-tight font-display">
                {isNaN(num) ? val : `${count}${suffix}`}
            </div>
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.22em] mb-1.5">{label}</div>
            <div className="text-[12.5px] text-slate-500 font-medium leading-snug">{sublabel}</div>
        </div>
    );
}

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

function ValueCard({ icon: Icon, title, desc, accent, delay }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string; desc: string; accent: string; delay: number;
}) {
    return (
        <div
            className="group relative bg-white rounded-[1.5rem] p-8 border border-slate-200/70
                       hover:border-blue-200 hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.12)]
                       transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`relative h-12 w-12 rounded-2xl flex items-center justify-center mb-6 ${accent} transition-transform duration-500 group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="relative font-black text-[15.5px] text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
            <p className="relative text-[13.5px] text-slate-500 leading-[1.75] font-light">{desc}</p>
        </div>
    );
}

function TimelineItem({ year, title, desc, isLast = false }: {
    year: string; title: string; desc: string; isLast?: boolean;
}) {
    return (
        <div className="relative flex gap-7 group">
            <div className="flex flex-col items-center">
                <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-blue-100 flex items-center justify-center shrink-0 z-10 shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-110">
                    <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                {!isLast && (
                    <div className="w-px flex-1 bg-gradient-to-b from-blue-200 via-blue-100 to-transparent mt-1.5" />
                )}
            </div>
            <div className="pb-10 pt-1.5 flex-1">
                <span className="inline-block text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 bg-blue-50 px-2.5 py-1 rounded-md">{year}</span>
                <h4 className="font-black text-[17px] text-slate-900 mb-2.5 leading-tight">{title}</h4>
                <p className="text-[14px] text-slate-500 leading-[1.75] font-light max-w-lg">{desc}</p>
            </div>
        </div>
    );
}

function RegionCard({ region, markets, detail, accent }: {
    region: string; markets: string; detail: string; accent: string;
}) {
    return (
        <div className="group bg-white/4 border border-white/8 rounded-2xl p-6
                        hover:bg-white/8 hover:border-white/18
                        transition-all duration-400 hover:-translate-y-1">
            <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${accent} mb-5 transition-all duration-400 group-hover:w-16`} />
            <h3 className="font-black text-white text-[17px] mb-1.5">{region}</h3>
            <div className="text-amber-400 text-[11.5px] font-bold tracking-wide mb-2">{markets}</div>
            <p className="text-slate-500 text-[12.5px] font-medium leading-snug">{detail}</p>
        </div>
    );
}

export default function AboutPage() {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);

    const stats = useReveal(0.2);
    const mission = useReveal(0.1);
    const story = useReveal(0.1);
    const values = useReveal(0.1);
    const global = useReveal(0.1);
    const certs = useReveal(0.1);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });
        lenis.on("scroll", (e: any) => {
            const sy = e.scroll;
            if (heroBgRef.current) heroBgRef.current.style.transform = `translateY(${sy * PARALLAX_BG}px)`;
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
                @keyframes overlayFadeOut { 0%{opacity:1} 80%{opacity:1} 100%{opacity:0;pointer-events:none} }
                @keyframes logoReveal { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                #page-overlay {
                    position:fixed;inset:0;z-index:9999;background:#06111e;
                    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;
                    animation:overlayFadeOut 1.4s cubic-bezier(.16,1,.3,1) 0.8s forwards;
                }
                #page-overlay .ov-logo { animation:logoReveal 0.5s cubic-bezier(.16,1,.3,1) both; }
                #page-overlay .ov-ring {
                    width:36px;height:36px;border:2px solid rgba(148,163,184,0.12);
                    border-top-color:#38bdf8;border-radius:50%;
                    animation:spin 0.75s linear infinite,logoReveal 0.5s cubic-bezier(.16,1,.3,1) 0.1s both;
                }
                @keyframes spin { to{transform:rotate(360deg)} }

                @keyframes scatterLeft  { from{opacity:0;transform:translateX(-60px) translateY(12px)} to{opacity:1;transform:translateX(0) translateY(0)} }
                @keyframes scatterRight { from{opacity:0;transform:translateX(60px) translateY(12px)}  to{opacity:1;transform:translateX(0) translateY(0)} }
                @keyframes scatterDown  { from{opacity:0;transform:translateY(-40px)} to{opacity:1;transform:translateY(0)} }
                .stat-scatter { opacity:0; }
                .stat-scatter.s-active:nth-child(1) { animation:scatterLeft  0.7s cubic-bezier(.16,1,.3,1) 0.05s forwards; }
                .stat-scatter.s-active:nth-child(2) { animation:scatterDown  0.7s cubic-bezier(.16,1,.3,1) 0.18s forwards; }
                .stat-scatter.s-active:nth-child(3) { animation:scatterDown  0.7s cubic-bezier(.16,1,.3,1) 0.31s forwards; }
                .stat-scatter.s-active:nth-child(4) { animation:scatterRight 0.7s cubic-bezier(.16,1,.3,1) 0.44s forwards; }

                .hero-grid {
                    background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
                    background-size:44px 44px;
                }
                .dot-grid-dark  { background-image:radial-gradient(circle,rgba(255,255,255,0.065) 1px,transparent 1px);background-size:28px 28px; }
                .dot-grid-light { background-image:radial-gradient(circle,rgba(0,0,0,0.04) 1px,transparent 1px);background-size:28px 28px; }
                .noise {
                    position:absolute;inset:0;pointer-events:none;opacity:0.032;
                    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                .rv  { transition:opacity 0.85s cubic-bezier(.16,1,.3,1),transform 0.85s cubic-bezier(.16,1,.3,1); }
                .rh  { opacity:0;transform:translateY(36px); }
                .rs  { opacity:1;transform:translateY(0); }
                @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
                .anim-1 { animation:fadeUp 1.5s cubic-bezier(.16,1,.3,1) both 1.3s; }
                .anim-2 { animation:fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 1.05s; }
                .anim-3 { animation:fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 1.20s; }
                .wc-layer { will-change:transform,opacity; }
                .shimmer-btn { position:relative;overflow:hidden; }
                .shimmer-btn::after {
                    content:'';position:absolute;inset:0;
                    background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%);
                    background-size:200% 100%;animation:cp-shimmer 2.8s ease infinite;
                }
                @keyframes cp-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
                .e-card { transition:all 0.45s cubic-bezier(.16,1,.3,1); }
                .e-card:hover { transform:translateY(-5px); }
                /* Fotoğraf hover zoom */
                .photo-zoom { overflow:hidden; }
                .photo-zoom img { transition:transform 0.7s cubic-bezier(.16,1,.3,1); }
                .photo-zoom:hover img { transform:scale(1.04); }
            `}</style>

            <div className="font-body bg-[#f2f4f8] min-h-screen">



                {/* ══ 1. HERO ══ */}
                <section className="relative h-[105vh] md:-mt-16 flex flex-col items-center justify-center bg-[#06111e] overflow-hidden">
                    <div ref={heroBgRef} className="absolute inset-0 z-0 wc-layer">
                        <div className="absolute inset-0 bg-cover bg-center opacity-[0.55]"
                            style={{ backgroundImage: "url('/abouthero.jpg')" }} />
                        <div className="absolute inset-0 hero-grid" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06111e]/80 to-[#06111e]" />
                    </div>
                    <div ref={heroContentRef} className="relative z-10 max-w-7xl mx-auto px-4 text-center wc-layer">
                        <div className="anim-1"><SectionLabel centered onDark>Our Identity</SectionLabel></div>
                        <h1 className="anim-2 font-black text-white leading-[1.05] mb-8 tracking-tight"
                            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
                            Global Reach, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Unwavering Integrity.</span>
                        </h1>
                        <p className="anim-3 text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
                            Curipharma operates at the vital intersection of global pharmaceutical supply chains and local healthcare needs, ensuring life-saving treatments are delivered without compromise.
                        </p>
                    </div>
                </section>

                {/* ══ 2. STATS BAR ══ */}
                <div ref={stats.ref} className="md:-mt-32 bg-slate-900 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
                            {[
                                { val: "50+", label: "Global Markets", sublabel: "Licensed distribution routes" },
                                { val: "2000+", label: "Product SKUs", sublabel: "Verified pharmaceutical catalog" },
                                { val: "15+", label: "Years Experience", sublabel: "Operational excellence" },
                                { val: "99%", label: "On-Time Rate", sublabel: "Cold-chain deliveries" },
                            ].map(s => (
                                <div key={s.label} className={`stat-scatter ${stats.v ? "s-active" : ""}`}>
                                    <StatCounter {...s} active={stats.v} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ 3. MISSION — fotoğraflı ══ */}
                <div ref={mission.ref}>
                    <section className={`bg-white py-32 border-b border-slate-100 rv ${mission.v ? "rs" : "rh"}`}>
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">

                                {/* Sol: Metin */}
                                <div className="lg:sticky lg:top-32 self-start">
                                    <SectionLabel>Our Mission</SectionLabel>
                                    <h2 className="font-display font-black text-slate-900 leading-[1.07] mb-7 tracking-tight"
                                        style={{ fontSize: "clamp(2rem, 3.8vw, 3rem)" }}>
                                        Making Life-Saving Medicine{" "}
                                        <span className="text-blue-600">Reach Every Patient</span>
                                    </h2>
                                    <p className="text-slate-500 text-[16.5px] leading-[1.85] font-light mb-6">
                                        We operate at the intersection of global logistics, regulatory expertise,
                                        and pharmaceutical science. Every shipment we manage carries the weight
                                        of a patient's treatment — that responsibility drives every decision we make.
                                    </p>
                                    <p className="text-slate-500 text-[16.5px] leading-[1.85] font-light mb-10">
                                        From procurement to customs clearance to temperature-controlled last-mile
                                        delivery, our vertically integrated model ensures zero compromise on
                                        product integrity or delivery timelines.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: ShieldCheck, text: "GDP & GMP Certified" },
                                            { icon: Snowflake, text: "Cold-Chain Experts" },
                                            { icon: Lock, text: "Regulatory Assurance" },
                                            { icon: Globe2, text: "Pan-Regional Network" },
                                        ].map(({ icon: Icon, text }) => (
                                            <div key={text} className="flex items-center gap-3 text-slate-700 font-bold text-[13.5px]">
                                                <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                    <Icon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sağ: Fotoğraf bloğu */}
                                <div className="flex flex-col gap-3">
                                    {/* Büyük ana fotoğraf */}
                                    <div className="relative rounded-[2rem] photo-zoom shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)]">
                                        <img
                                            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1200&auto=format&fit=crop"
                                            alt="Pharmaceutical warehouse"
                                            className="w-full h-[340px] object-cover rounded-[2rem]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#06111e]/70 via-transparent to-transparent rounded-[2rem]" />
                                        {/* Live badge */}
                                        <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-3.5 py-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10.5px] font-bold text-white tracking-wide">GDP-Certified Storage</span>
                                        </div>
                                        {/* Alt overlay */}
                                        <div className="absolute bottom-6 left-6">
                                            <div className="text-[10px] font-black text-blue-300 uppercase tracking-[0.18em] mb-1">Temperature-Controlled</div>
                                            <div className="text-white font-black text-[18px] leading-tight">24/7 Monitored Warehousing</div>
                                        </div>
                                    </div>

                                    {/* İki küçük fotoğraf */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative rounded-[1.5rem] photo-zoom shadow-md">
                                            <img
                                                src="https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=600&auto=format&fit=crop"
                                                alt="Quality control laboratory"
                                                className="w-full h-[170px] object-cover rounded-[1.5rem]"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent rounded-[1.5rem]" />
                                            <div className="absolute bottom-4 left-4 right-3">
                                                <div className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-0.5">QC Lab</div>
                                                <div className="text-white font-bold text-[12.5px] leading-tight">Batch Testing & CoA</div>
                                            </div>
                                        </div>
                                        <div className="relative rounded-[1.5rem] photo-zoom shadow-md">
                                            <img
                                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop"
                                                alt="Global logistics"
                                                className="w-full h-[170px] object-cover rounded-[1.5rem]"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent rounded-[1.5rem]" />
                                            <div className="absolute bottom-4 left-4 right-3">
                                                <div className="text-[9px] font-black text-cyan-300 uppercase tracking-widest mb-0.5">Logistics</div>
                                                <div className="text-white font-bold text-[12.5px] leading-tight">50+ Countries</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vision kartı — tam genişlik alt */}
                            <div className="relative">
                                <div className="absolute -inset-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2.5rem] opacity-70 blur-2xl" />
                                <div className="relative bg-white rounded-[2rem] border border-slate-200/70 p-10 shadow-[0_8px_50px_-12px_rgba(37,99,235,0.12)]">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                        <div className="lg:col-span-4 flex items-start gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/25">
                                                <TrendingUp className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-display font-black text-[21px] text-slate-900 mb-2">Our Vision</h3>
                                                <p className="text-slate-500 text-[14px] leading-[1.8] font-light">
                                                    To become the most trusted pharmaceutical wholesale partner in emerging and established markets worldwide.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-8">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                                {[
                                                    "Zero-tolerance quality policy across all SKUs",
                                                    "Full traceability from manufacturer to patient",
                                                    "Regulatory compliance in every market we serve",
                                                ].map(item => (
                                                    <div key={item} className="flex items-start gap-2.5 text-[13px] text-slate-700 font-semibold bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-slate-400 text-[13px] italic font-light leading-relaxed border-t border-slate-100 pt-4">
                                                "Integrity is the foundation of our supply chain. We treat every package as a patient's hope."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══ 4. TIMELINE ══ */}
                <div ref={story.ref}>
                    <section className={`bg-[#f2f4f8] py-32 border-b border-slate-200/60 rv ${story.v ? "rs" : "rh"}`}>
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                                <div className="lg:w-5/12 lg:sticky lg:top-32 self-start">
                                    <SectionLabel>Our Evolution</SectionLabel>
                                    <h2 className="font-display font-black text-slate-900 leading-[1.07] mb-5 tracking-tight"
                                        style={{ fontSize: "clamp(2rem, 3.8vw, 2.9rem)" }}>
                                        A Legacy Built on <span className="text-blue-600">Reliability</span>
                                    </h2>
                                    <p className="text-slate-500 text-[15.5px] leading-[1.85] font-light mb-8">
                                        From a regional wholesaler to a multi-continent pharmaceutical distribution network — built one trusted partnership at a time.
                                    </p>
                                    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <Cpu className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">HQ Location</span>
                                        </div>
                                        <p className="text-[13.5px] text-slate-500 font-light leading-relaxed">
                                            Gebze Technical University Technopark, Kocaeli — connecting Europe &amp; Asia at the world's most critical trade corridor.
                                        </p>
                                    </div>
                                </div>
                                <div className="lg:w-7/12 pt-2">
                                    <TimelineItem year="2009" title="Company Founded" desc="Established in Kocaeli, Turkey with a focus on supplying licensed wholesalers. First GDP certification obtained within 12 months of launch." />
                                    <TimelineItem year="2012" title="First International Contract" desc="Secured first export agreement with a regional distributor in the Balkans, marking the start of our international expansion strategy." />
                                    <TimelineItem year="2015" title="Cold-Chain Infrastructure" desc="Invested in dedicated temperature-controlled warehousing and logistics partnerships to support oncology and biologics portfolios." />
                                    <TimelineItem year="2018" title="ISO 9001:2015 Certification" desc="Achieved ISO 9001:2015 certification, formalizing quality management systems across procurement, storage, and distribution." />
                                    <TimelineItem year="2021" title="GMP Compliance Upgrade" desc="Extended GMP compliance to cover all agency and import operations, enabling access to stricter regulatory markets in Western Europe and the Gulf." />
                                    <TimelineItem year="2024" title="50+ Country Network" isLast desc="Active supply relationships now span 50+ countries across Europe, MENA, and Sub-Saharan Africa, with a catalog exceeding 2,000 SKUs." />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══ 5. CORE VALUES ══ */}
                <div ref={values.ref}>
                    <section className={`relative bg-white py-32 border-b border-slate-100 overflow-hidden rv ${values.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 dot-grid-light opacity-40 pointer-events-none" />
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className="text-center mb-16 flex flex-col items-center">
                                <SectionLabel centered>Corporate Values</SectionLabel>
                                <h2 className="font-display font-black text-slate-900 leading-[1.07] tracking-tight mt-1"
                                    style={{ fontSize: "clamp(2rem, 3.8vw, 2.9rem)" }}>
                                    The Principles of Excellence
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                                <div className="md:col-span-2 e-card relative bg-slate-950 rounded-[1.75rem] p-10 overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.07] text-blue-400"><Globe2 size={200} strokeWidth={0.8} /></div>
                                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px]" />
                                    <div className="relative z-10">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-7 shadow-lg shadow-blue-600/30">
                                            <Globe2 className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="font-display font-black text-white text-[22px] mb-3">Unrivaled Global Network</h3>
                                        <p className="text-slate-400 text-[15px] leading-[1.8] font-light max-w-lg mb-6">
                                            Strategically headquartered at Gebze Technopark, we connect European and Asian pharmaceutical corridors with unmatched regulatory fluency.
                                        </p>
                                        <div className="flex items-center gap-10">
                                            {[["100%", "Traceability"], ["50+", "Partners"], ["24/7", "Support"]].map(([val, lbl]) => (
                                                <div key={lbl}>
                                                    <div className="text-2xl font-display font-black text-white">{val}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{lbl}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="e-card bg-blue-600 rounded-[1.75rem] p-8 relative overflow-hidden group flex flex-col justify-between">
                                    <div className="absolute -bottom-8 -right-8 opacity-10"><Target size={140} strokeWidth={1} /></div>
                                    <div>
                                        <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center mb-7"><Target className="h-5 w-5 text-white" /></div>
                                        <h3 className="font-display font-black text-white text-[20px] mb-3">Precision</h3>
                                        <p className="text-blue-100/80 text-[13.5px] leading-[1.75] font-light">Zero-error tolerance in batch tracking, documentation management, and cold-chain monitoring.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <ValueCard icon={ShieldCheck} title="Uncompromising Quality" desc="Every product in our portfolio meets stringent GMP and GDP standards. We source exclusively from verified, licensed manufacturers." accent="bg-blue-50 text-blue-600" delay={0} />
                                <ValueCard icon={Globe2} title="Global Reach, Local Care" desc="We operate in 50+ countries but maintain dedicated regional expertise — understanding local regulations and market dynamics." accent="bg-cyan-50 text-cyan-600" delay={100} />
                                <ValueCard icon={Snowflake} title="Cold-Chain Integrity" desc="Temperature-sensitive products receive dedicated logistics with real-time monitoring from warehouse to final destination." accent="bg-indigo-50 text-indigo-600" delay={200} />
                                <ValueCard icon={Lock} title="Regulatory Transparency" desc="Full documentation, traceability, and compliance support for every market. We make regulatory complexity our problem, not yours." accent="bg-emerald-50 text-emerald-600" delay={300} />
                                <ValueCard icon={Heart} title="Patient-Centred Purpose" desc="Behind every order is a patient. That responsibility is the constant reminder of why precision and reliability are non-negotiable." accent="bg-rose-50 text-rose-600" delay={400} />
                                <ValueCard icon={Zap} title="Speed Without Shortcuts" desc="Responsive supply chains and expedited customs solutions — without ever cutting corners on product integrity." accent="bg-amber-50 text-amber-600" delay={500} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══ 6. GLOBAL OPERATIONS — fotoğraflı ══ */}
                <div ref={global.ref}>
                    <section className="relative bg-[#060f1c] py-32 overflow-hidden">
                        <div className="absolute inset-0 dot-grid-dark opacity-35 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-600/7 rounded-full blur-[120px] pointer-events-none" />
                        <div className="noise" />
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

                            <div className={`text-center mb-16 flex flex-col items-center rv ${global.v ? "rs" : "rh"}`}>
                                <SectionLabel centered onDark>Global Operations</SectionLabel>
                                <h2 className="font-display font-black text-white mt-1 mb-5 tracking-tight"
                                    style={{ fontSize: "clamp(2rem, 3.8vw, 2.9rem)" }}>
                                    Where We Operate
                                </h2>
                                <p className="text-slate-400 text-[15.5px] font-light leading-[1.85] max-w-2xl">
                                    Strategic presence across Europe, MENA, Sub-Saharan Africa, and Central Asia — with customs and regulatory expertise in every corridor we serve.
                                </p>
                            </div>

                            {/* Fotoğraf + Region kartlar yan yana */}
                            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 rv ${global.v ? "rs" : "rh"}`}>

                                {/* Sol: dünya fotoğrafı */}
                                <div className="relative rounded-[2rem] photo-zoom shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] h-[380px] lg:h-auto">
                                    <img
                                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
                                        alt="Global pharmaceutical network"
                                        className="w-full h-full object-cover rounded-[2rem]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#060f1c]/85 via-[#060f1c]/25 to-transparent rounded-[2rem]" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#060f1c]/35 rounded-[2rem]" />

                                    {/* Üst badge */}
                                    <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10.5px] font-bold text-white tracking-wide">Active Supply Network</span>
                                    </div>

                                    {/* Alt stats */}
                                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                                        <div>
                                            <div className="text-[10px] font-black text-blue-300 uppercase tracking-[0.18em] mb-1">Total Coverage</div>
                                            <div className="text-white font-black text-[36px] leading-none tabular-nums">54</div>
                                            <div className="text-slate-400 text-[12px] font-medium mt-0.5">Countries served</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.18em] mb-1">Corridors</div>
                                            <div className="text-white font-black text-[36px] leading-none">4</div>
                                            <div className="text-slate-400 text-[12px] font-medium mt-0.5">Major regions</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sağ: region kartlar 2x2 */}
                                <div className="grid grid-cols-2 gap-4 content-start">
                                    {[
                                        { region: "Europe", markets: "28 countries", detail: "EU GDP-compliant routes", accent: "from-blue-500 to-blue-600" },
                                        { region: "MENA", markets: "12 countries", detail: "Gulf & Levant supply chains", accent: "from-cyan-500 to-blue-500" },
                                        { region: "Central Asia", markets: "6 countries", detail: "CIS regulatory expertise", accent: "from-indigo-500 to-blue-500" },
                                        { region: "Sub-Saharan Africa", markets: "8 countries", detail: "WHO PQ-aligned supply", accent: "from-blue-600 to-cyan-500" },
                                    ].map(r => <RegionCard key={r.region} {...r} />)}
                                </div>
                            </div>

                            {/* Alt 3 özellik kutusu */}
                            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 rv ${global.v ? "rs" : "rh"}`}>
                                {[
                                    { icon: Award, label: "24/7 Customs Support", desc: "Round-the-clock documentation and customs clearance assistance." },
                                    { icon: Users, label: "Local Regulatory Experts", desc: "In-country specialists for import licensing and dossier management." },
                                    { icon: Snowflake, label: "End-to-End Cold Chain", desc: "GDP-certified cold-chain from manufacturer to final point of delivery." },
                                ].map(({ icon: Icon, label, desc }) => (
                                    <div key={label} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] transition-colors duration-300">
                                        <div className="h-11 w-11 rounded-xl bg-blue-500/12 border border-blue-500/18 flex items-center justify-center shrink-0">
                                            <Icon className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-[14px] mb-1">{label}</div>
                                            <div className="text-slate-500 text-[13px] font-light leading-relaxed">{desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══ 7. CERTIFICATIONS + CTA ══ */}
                <div ref={certs.ref}>
                    <section className={`relative bg-white py-32 overflow-hidden rv ${certs.v ? "rs" : "rh"}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-white to-white pointer-events-none" />
                        <div className="absolute inset-0 dot-grid-light opacity-20 pointer-events-none" />
                        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
                            <div className="mb-20">
                                <SectionLabel centered>Ready to Partner</SectionLabel>
                                <h2 className="font-display font-black text-slate-900 mb-5 mt-2 leading-tight tracking-tight"
                                    style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.3rem)" }}>
                                    Let's Build a{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Reliable Supply Chain</span>
                                    {" "}Together
                                </h2>
                                <p className="text-slate-500 text-[17px] leading-[1.85] max-w-xl mx-auto font-light mb-10">
                                    Whether you're a hospital group, regional distributor, or NGO — we have the products, certifications, and logistics infrastructure to serve you.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link to="/contact" className="shimmer-btn inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_8px_28px_rgba(37,99,235,0.28)] hover:shadow-[0_14px_36px_rgba(37,99,235,0.38)] hover:-translate-y-0.5">
                                        Contact Our Team <ArrowRight className="h-4.5 w-4.5" />
                                    </Link>
                                    <Link to="/products" className="inline-flex items-center gap-2.5 bg-white border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-600 px-10 py-4 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-0.5">
                                        Browse Catalog <ChevronRight className="h-4.5 w-4.5" />
                                    </Link>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-16">
                                <div className="text-[10px] font-black tracking-[0.24em] uppercase text-slate-400 mb-10">Internationally Certified &amp; Compliant</div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { code: "GDP Certified", desc: "Good Distribution" },
                                        { code: "Wholesale License", desc: "Authorized Dist." },
                                        { code: "ISO 9001:2015", desc: "Quality Management" },
                                        { code: "GMP Compliant", desc: "Manufacturing Stds." },
                                    ].map(({ code, desc }) => (
                                        <div key={code} className="group bg-slate-50 border border-slate-100/80 rounded-2xl p-5 flex flex-col items-center text-center hover:bg-white hover:border-blue-200 hover:shadow-[0_8px_24px_-8px_rgba(37,99,235,0.14)] transition-all duration-300">
                                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-3.5 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-400">
                                                <ShieldCheck className="h-5.5 w-5.5 text-blue-600 group-hover:text-white transition-colors duration-400" />
                                            </div>
                                            <div className="text-[14px] font-extrabold text-slate-900 mb-0.5">{code}</div>
                                            <div className="text-[11.5px] text-slate-500 font-medium">{desc}</div>
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