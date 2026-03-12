import {
    ArrowRight, ShieldCheck, Globe2, PackageCheck, Snowflake,
    Pill, ShieldPlus, Syringe, Building2, TestTubes,
    Stethoscope, Award, FileText, ChevronRight, Zap,
    CheckCircle2, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis"; // Yağ gibi akan (Smooth) Scroll Kütüphanesi

/* ─────────────────────────────────────────
   HooK: Scroll Reveal (Aşağı kaydırdıkça belirme)
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   HooK: Animated Counter (Sayı Saydırma)
───────────────────────────────────────── */
function useCounter(target: number, start: boolean): number {
    const [n, setN] = useState<number>(0);
    useEffect(() => {
        if (!start || isNaN(target)) return;
        let t0: number | undefined;
        const step = (ts: number) => {
            if (t0 === undefined) t0 = ts;
            const p = Math.min((ts - t0) / 1800, 1);
            setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, start]);
    return n;
}

/* ─────────────────────────────────────────
   Bileşen: Infinite Marquee (Sonsuz Şerit)
───────────────────────────────────────── */
interface MarqueeProps { items: React.ReactNode[]; reverse?: boolean; speed?: number; }
function Marquee({ items, reverse = false, speed = 40 }: MarqueeProps) {
    const cloned = [...items, ...items, ...items];
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

/* ─────────────────────────────────────────
   Bileşen: Animasyonlu İstatistik Kartı (StatCard)
───────────────────────────────────────── */
interface StatCardProps { val: string; label: string; icon: any; start: boolean; delay: number; }
function StatCard({ val, label, icon: Icon, start }: StatCardProps) {
    const num = parseInt(val.replace(/\D/g, ""), 10);
    const suffix = val.replace(/\d/g, "");
    const count = useCounter(isNaN(num) ? 0 : num, start);

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-10 flex flex-col items-center text-center gap-5 hover:-translate-y-1 transition-transform cursor-default">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Icon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-[48px] font-black text-white leading-none drop-shadow-md tabular-nums">
                {isNaN(num) ? val : `${count}${suffix}`}
            </div>
            <div className="text-[13px] text-blue-300 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}

/* ─────────────────────────────────────────
   Yardımcı: Section başlık bloğu
───────────────────────────────────────── */
function SectionLabel({ children, centered = false }: { children: React.ReactNode, centered?: boolean }) {
    return (
        <div className={`inline-flex items-center gap-2 mb-4 ${centered ? 'mx-auto justify-center' : ''}`}>
            <span className="h-px w-8 bg-blue-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600">{children}</span>
            {centered && <span className="h-px w-8 bg-blue-500" />}
        </div>
    );
}

/* ─────────────────────────────────────────
   Ana Bileşen
───────────────────────────────────────── */
export default function HomePage() {

    // Yumuşak Scroll (Lenis) Entegrasyonu
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Çok soft bir momentum eğrisi
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Scroll Reveal Hook'ları
    const services = useReveal(0.1);
    const clientsSec = useReveal(0.1);
    const globalOps = useReveal(0.2);
    const quality = useReveal(0.2);

    // Üst Şerit Datası
    const topMarqueeItems = [
        <><ShieldCheck className="w-4 h-4 text-blue-400" /> GDP Compliant</>,
        <><Award className="w-4 h-4 text-blue-400" /> ISO 9001:2015</>,
        <><Snowflake className="w-4 h-4 text-blue-400" /> Cold-Chain Verified</>,
        <><PackageCheck className="w-4 h-4 text-blue-400" /> Licensed Wholesaler</>,
        <><CheckCircle2 className="w-4 h-4 text-blue-400" /> GMP Certified</>,
        <><Globe2 className="w-4 h-4 text-blue-400" /> WHO PQ Standards</>,
    ];

    // Alt Şerit Datası
    const bottomMarqueeItems = [
        <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" /> Public Hospitals</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" /> Private Clinics</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" /> Research Centers</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" /> Licensed Pharmacies</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" /> Regional Distributors</>,
        <><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0" /> Government Agencies</>,
    ];

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <style>{`
                /* Çift Scrollbar Fix (Kök Çözüm) */
                html, body { 
                    overflow-x: hidden; 
                    width: 100%; 
                    margin: 0; 
                    padding: 0; 
                    overscroll-behavior-y: none; /* Mac'lerdeki sekmeyi engeller */
                }

                .font-body { font-family: 'DM Sans', system-ui, sans-serif; }

                /* Giriş Animasyonları */
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .anim-1 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.1s; }
                .anim-2 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.25s; }
                .anim-3 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.4s; }
                .anim-4 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both 0.55s; }
                .anim-fade { animation: fadeIn 1.2s ease both 0.2s; }

                /* Sonsuz Şerit (Marquee) */
                @keyframes mq  { from { transform: translateX(0); }         to { transform: translateX(-33.333%); } }
                @keyframes mqr { from { transform: translateX(-33.333%); }  to { transform: translateX(0); } }
                .animate-marquee     { animation: mq  var(--spd, 40s) linear infinite; }
                .animate-marquee-rev { animation: mqr var(--spd, 40s) linear infinite; }
                .animate-marquee:hover, .animate-marquee-rev:hover { animation-play-state: paused; }

                /* Scroll Reveal Classları */
                .rv { transition: opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1); }
                .rh { opacity: 0; transform: translateY(40px); }
                .rs { opacity: 1; transform: translateY(0); }

                /* Premium Shimmer Efekti */
                .shimmer { position: relative; overflow: hidden; }
                .shimmer::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.25) 50%, transparent 65%);
                    background-size: 200% 100%;
                    animation: sh 2.8s ease infinite;
                }
                @keyframes sh { 0% { background-position:-200% center } 100% { background-position:200% center } }

                /* Tasarım Kalıpları */
                .dot-grid {
                    background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
                .diagonal-clip { clip-path: polygon(0 0, 100% 0, 100% 95%, 0 100%); }
                
                /* Global Kısım - Noise ve Dönen Halkalar */
                .noise-overlay {
                    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes spin-rev { 100% { transform: rotate(-360deg); } }
                .spin-ring { animation: spin 20s linear infinite; }
                .spin-ring-rev { animation: spin-rev 25s linear infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                .orb-float { animation: float 6s ease-in-out infinite; }
                .orb-float-2 { animation: float 8s ease-in-out infinite reverse; }
            `}</style>

            {/* overflow-x-hidden BURADAN KALDIRILDI. Çünkü Çift Scrollbara sebep oluyordu. */}
            <div className="font-body flex flex-col min-h-screen bg-slate-50 w-full overflow-clip">

                {/* ══════════════════════════════════════
                    1. HERO 
                ══════════════════════════════════════ */}
                <section className="relative min-h-[90vh] md:min-h-[100vh] flex flex-col items-center justify-center diagonal-clip pt-32 pb-[15vh]">

                    <div className="absolute inset-0 z-0 anim-fade">
                        <div
                            className="absolute inset-0 w-full h-full"
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

                    <div className="relative z-10 max-w-5xl mx-auto px-4 w-full flex flex-col items-center text-center -mt-10 md:-mt-40">

                        {/* SAAS PREMIUM SOFT GLOW ETİKET */}
                        <div className="anim-1 relative group inline-flex mb-8 cursor-default">
                            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-500/20 blur-[4px] opacity-40 animate-pulse transition duration-1000"></div>

                            <div className="relative flex items-center gap-2.5 px-6 py-2 rounded-full border border-blue-400/10 bg-white/5 backdrop-blur-md">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-300">
                                    Premier Pharmaceutical Wholesaler
                                </span>
                            </div>
                        </div>

                        {/* Devasa Başlık */}
                        <h1 className="font-black anim-2 text-white leading-[1.05] mb-6 drop-shadow-2xl"
                            style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}>
                            Leading the Future of <br className="hidden md:block" />
                            <span className="relative inline-block mt-2 md:mt-0">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                    Global Pharma
                                </span>
                                <span className="absolute -bottom-2 left-0 right-0 h-[4px] bg-blue-500/30 rounded-full blur-[2px]" />
                            </span>
                            {" "}Distribution
                        </h1>

                        <p className="anim-3 text-slate-400 text-[16px] md:text-[18px] leading-relaxed mb-10 max-w-3xl font-light drop-shadow-md">
                            We integrate procurement, agency services, customs clearance, and distribution into a seamless one-stop solution. <strong className="text-white font-medium">GMP & GDP certified</strong> for absolute reliability.
                        </p>

                        <div className="anim-4 flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
                            <Link to="/products"
                                className="shimmer w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-9 py-4 rounded-xl text-[15px] font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:-translate-y-1"
                            >
                                View Product Catalog
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link to="/contact"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/25 px-9 py-4 rounded-xl text-[15px] font-semibold transition-all backdrop-blur-md hover:-translate-y-1"
                            >
                                Partner With Us
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    2. DOUBLE MARQUEE
                ══════════════════════════════════════ */}
                <section className="relative z-20 -mt-24 px-4 md:px-8 max-w-[95rem] mx-auto w-full">
                    <div className="bg-[#0b1120]/90 backdrop-blur-xl border border-slate-700/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden relative">
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0b1120] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0b1120] to-transparent z-10 pointer-events-none" />

                        <Marquee items={topMarqueeItems} speed={35} />
                        <div className="border-t border-slate-700/50" />
                        <Marquee items={bottomMarqueeItems} reverse speed={45} />
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    3. HİZMETLER
                ══════════════════════════════════════ */}
                <div ref={services.ref}>
                    <section className={`bg-slate-50 pt-32 pb-24 border-b border-slate-200 rv ${services.v ? "rs" : "rh"}`}>
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="text-center mb-16 flex flex-col items-center">
                                <SectionLabel centered>Our Comprehensive Solutions</SectionLabel>
                                <h2 className="font-black text-slate-900 leading-tight mt-2 mb-4"
                                    style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                                    Excellence in Every Detail
                                </h2>
                                <p className="text-slate-500 text-[16px] leading-relaxed max-w-2xl">
                                    The pharmaceutical industry demands precision and speed. Our service pillars ensure life-saving treatments reach patients safely and on time.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: ShieldPlus,
                                        title: "Brand Name Medicines",
                                        desc: "Long-term strategic partnerships with leading manufacturers in Europe, the US, and Japan — ensuring authentic, high-quality products.",
                                        tag: "Brand Name",
                                    },
                                    {
                                        icon: Pill,
                                        title: "Generic Drugs",
                                        desc: "Affordable, high-quality pharmaceutical solutions bridging the gap between medical innovation and patient access worldwide.",
                                        tag: "Generic",
                                    },
                                    {
                                        icon: Syringe,
                                        title: "Medical Supplies",
                                        desc: "A comprehensive portfolio of innovative, specialty, and rare medications focused on Oncology, Rare Diseases, and Chronic Care.",
                                        tag: "Specialty",
                                    },
                                ].map(({ icon: Icon, title, desc, tag }) => (
                                    <div key={title}
                                        className="bg-white rounded-3xl p-10 border border-slate-200 hover:border-blue-300 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col transform hover:-translate-y-2 cursor-default">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all duration-300 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                                                {tag}
                                            </span>
                                        </div>
                                        <h4 className="font-extrabold text-[22px] text-slate-900 mb-4">{title}</h4>
                                        <p className="text-slate-500 text-[15px] leading-relaxed flex-1 font-light">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    4. KİMLERE HİZMET VERİYORUZ
                ══════════════════════════════════════ */}
                <div ref={clientsSec.ref}>
                    <section className={`bg-white py-32 border-b border-slate-100 overflow-hidden relative rv ${clientsSec.v ? "rs" : "rh"}`}>
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 rounded-l-[100px] pointer-events-none hidden lg:block" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <div className="pr-0 lg:pr-10">
                                    <SectionLabel>Who We Serve</SectionLabel>
                                    <h2 className="font-black text-slate-900 mb-8 leading-tight"
                                        style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}>
                                        A Vital Link in<br />
                                        <span className="text-blue-600">Global Healthcare</span>
                                    </h2>
                                    <p className="text-slate-500 text-[16px] leading-relaxed mb-10 font-light">
                                        Our operations span international markets, serving a diverse clientele. We maintain rigorous oversight to ensure patient safety and product efficacy at every step of the supply chain.
                                    </p>
                                    <ul className="space-y-4 mb-10">
                                        {[
                                            "International GMP & GDP standards",
                                            "Cold-chain logistics expertise",
                                            "24/7 customs operations support",
                                            "Supply capacity in 50+ countries",
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-4 text-[15px] text-slate-700 font-medium">
                                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { icon: Building2, title: "Hospitals", sub: "Public & Private Sectors" },
                                        { icon: TestTubes, title: "Research Inst.", sub: "Clinical R&D Centers" },
                                        { icon: Stethoscope, title: "Pharmacies", sub: "Verified Retailers" },
                                        { icon: Globe2, title: "Distributors", sub: "Regional Network" },
                                    ].map(({ icon: Icon, title, sub }) => (
                                        <div key={title}
                                            className="group bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-3xl p-8 flex flex-col items-start gap-6 transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] cursor-default">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center shadow-sm transition-all duration-300 group-hover:-translate-y-1">
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className="text-[18px] font-extrabold text-slate-900 leading-tight mb-1">{title}</div>
                                                <div className="text-[13px] text-slate-500 font-medium">{sub}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    5. KÜRESEL LOJİSTİK (Animated Counters + Net Resim + Dönen Halkalar)
                ══════════════════════════════════════ */}
                <div ref={globalOps.ref}>
                    <section className="relative bg-[#060f1c] py-32 overflow-hidden">

                        {/* Background Photo (Orijinal netliğine getirildi) */}
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

                        {/* Merkez ve Yüzen Parlamalar */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="orb-float absolute left-[8%] top-[20%] w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                        <div className="orb-float-2 absolute right-[8%] bottom-[20%] w-52 h-52 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

                        {/* Sol Taraftaki Yuvarlak Simge (Dönen Halkalar) */}
                        <div className="absolute left-[-2%] lg:left-[4%] top-1/2 -translate-y-1/2 w-72 h-72 hidden md:block pointer-events-none opacity-40">
                            <div className="spin-ring absolute inset-0 border-[1.5px] border-dashed border-blue-400/50 rounded-full" />
                            <div className="spin-ring-rev absolute inset-8 border-[1.5px] border-dotted border-cyan-300/60 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)]" />
                        </div>

                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                            <div className={`text-center mb-16 flex flex-col items-center rv ${globalOps.v ? "rs" : "rh"}`}>
                                <SectionLabel centered>Global Operations</SectionLabel>
                                <h2 className="font-extrabold text-white mt-2 mb-4"
                                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                                    Global Pharmaceutical Logistics
                                </h2>
                                <p className="text-slate-400 max-w-2xl mx-auto text-[16px] leading-relaxed font-light">
                                    Navigating complex international regulations and customs procedures. Our strategic supply routes connect{" "}
                                    <span className="text-blue-400 font-semibold">Europe, Asia, and the Americas</span> with flawless execution.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {[
                                    { val: "50+", label: "Countries Served", icon: Globe2 },
                                    { val: "100%", label: "Cold-Chain Integrity", icon: Snowflake },
                                    { val: "24/7", label: "Customs Support", icon: Zap },
                                ].map(({ val, label, icon }, i) => (
                                    <div key={label}
                                        className={`rv ${globalOps.v ? "rs" : "rh"}`}
                                        style={{ transitionDelay: `${i * 120}ms` }}
                                    >
                                        <StatCard val={val} label={label} icon={icon} delay={i * 120} start={globalOps.v} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════
                    6. KALİTE & CTA BİRLEŞİMİ
                ══════════════════════════════════════ */}
                <div ref={quality.ref}>
                    <section className={`bg-slate-50 py-32 border-t border-slate-200 rv ${quality.v ? "rs" : "rh"}`}>
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                                <div className="space-y-5">
                                    {[
                                        { code: "GDP Certificate", full: "Good Distribution Practice Certified", issuer: "Ministry of Health" },
                                        { code: "Wholesale License", full: "Authorized Pharmaceutical Distributor", issuer: "General Directorate of Pharmaceuticals" },
                                        { code: "ISO 9001:2015", full: "Quality Management System Certificate", issuer: "TÜV Rheinland" },
                                    ].map(({ code, full, issuer }) => (
                                        <div key={code}
                                            className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-6 flex items-center gap-6 shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-default">
                                            <div className="h-16 w-14 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                                                <FileText className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[16px] font-extrabold text-slate-900 leading-tight mb-1">{code}</div>
                                                <div className="text-[13px] text-slate-500 font-medium">{full}</div>
                                                <div className="text-[11px] text-blue-600 font-bold mt-2 tracking-widest uppercase">{issuer}</div>
                                            </div>
                                            <Award className="h-8 w-8 text-slate-100 group-hover:text-blue-200 transition-colors shrink-0" />
                                        </div>
                                    ))}
                                </div>

                                <div className="pl-0 lg:pl-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="text-[11px] font-bold tracking-[.2em] uppercase text-blue-500">Ready to Ship Globally</span>
                                    </div>
                                    <h2 className="font-black text-slate-900 mb-8 leading-tight"
                                        style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}>
                                        Start Sourcing <br />
                                        <span className="text-blue-600">Smarter Today.</span>
                                    </h2>
                                    <p className="text-slate-500 text-[16px] leading-relaxed mb-10 max-w-lg font-light">
                                        Join hundreds of healthcare institutions worldwide who trust us for reliable, compliant, and temperature-controlled pharmaceutical supply.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link to="/contact"
                                            className="shimmer inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-[14px] font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                            Request a Quote <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </>
    );
}