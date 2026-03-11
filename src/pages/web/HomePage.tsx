import {
    ArrowRight, ShieldCheck, Globe2, PackageCheck, Snowflake,
    Pill, ShieldPlus, Syringe, Building2, TestTubes,
    Stethoscope, Award, FileText, ChevronRight, Zap,
    CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────
   Yardımcı: Section başlık bloğu
───────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-blue-500" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-600">
                {children}
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────
   Ana bileşen
───────────────────────────────────────── */
export default function HomePage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
            />

            <style>{`
                .font-display { font-family: 'DM Sans', system-ui, sans-serif; }
                .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes counterUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .anim-1 { animation: fadeUp 0.7s ease both 0.1s; }
                .anim-2 { animation: fadeUp 0.7s ease both 0.25s; }
                .anim-3 { animation: fadeUp 0.7s ease both 0.4s; }
                .anim-4 { animation: fadeUp 0.7s ease both 0.55s; }
                .anim-fade { animation: fadeIn 1.2s ease both 0.2s; }

                .dot-grid {
                    background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
                .diagonal-clip {
                    clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
                }
                .diagonal-clip-bottom {
                    clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
                }
                .service-card:hover .service-icon {
                    background: #2563eb;
                    color: #fff;
                    transform: scale(1.08);
                }
                .stat-card {
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(12px);
                    transition: border-color 0.2s, background 0.2s;
                }
                .stat-card:hover {
                    border-color: rgba(59,130,246,0.4);
                    background: rgba(59,130,246,0.08);
                }
            `}</style>

            <div className="font-body flex flex-col min-h-screen overflow-x-hidden">

                {/* ══════════════════════════════════════
                    1. HERO
                ══════════════════════════════════════ */}
                <section
                    className="relative min-h-[680px] md:min-h-[760px] flex items-center diagonal-clip"
                    style={{
                        background: "linear-gradient(135deg, #071525 0%, #0d2240 60%, #0a2d5e 100%)",
                    }}
                >
                    {/* Dot grid texture */}
                    <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />

                    {/* Glow blob */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                    {/* Fotoğraf - sağda overlay'li */}
                    <div className="absolute inset-0 z-0 anim-fade">
                        <div
                            className="absolute right-0 top-0 bottom-0 w-full md:w-1/2"
                            style={{
                                backgroundImage: "url('https://i.hizliresim.com/ke9lr02.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {/* Sola doğru gradient fade */}
                            <div className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(to right, #071525 0%, #071525 5%, rgba(7,21,37,0.85) 40%, rgba(7,21,37,0.3) 100%)"
                                }} />
                        </div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-12 pb-32 md:pt-6 md:pb-32">
                        <div className="max-w-[600px]">

                            {/* Etiket */}
                            <div className="anim-1 inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-blue-400/25 bg-blue-500/10">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-300">
                                    Premier Pharmaceutical Wholesaler
                                </span>
                            </div>

                            {/* Başlık */}
                            <h1 className="font-extrabold anim-2 text-white leading-[1.12] mb-6"
                                style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
                                Leading the Future of{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-blue-400">Global Pharma</span>
                                    <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-blue-500/50 rounded-full" />
                                </span>
                                {" "}Distribution
                            </h1>

                            {/* Alt yazı */}
                            <p className="anim-3 text-slate-400 text-[15px] leading-relaxed mb-10 max-w-[480px] font-light">
                                We integrate procurement, agency services, customs clearance, and distribution into a seamless one-stop solution — GMP & GDP certified.
                            </p>

                            {/* CTA'lar */}
                            <div className="anim-4 flex flex-col sm:flex-row gap-3">
                                <Link to="/products"
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-7 py-3.5 rounded-lg text-[14px] font-bold transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5 hover:shadow-blue-600/40">
                                    View Product Catalog
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link to="/contact"
                                    className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 hover:border-white/25 px-7 py-3.5 rounded-lg text-[14px] font-semibold transition-all backdrop-blur-sm">
                                    Partner With Us
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </Link>
                            </div>

                            {/* Küçük güven notu */}
                            <div className="anim-4 mt-8 flex items-center gap-4">
                                {["GMP Certified", "GDP Compliant", "ISO 9001"].map((t, i) => (
                                    <span key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 hidden xl:flex flex-col gap-3 z-10 anim-3">
                        {[
                            { val: "50+", label: "Countries Served" },
                            { val: "100%", label: "Cold-Chain Integrity" },
                            { val: "24/7", label: "Logistics Support" },
                        ].map(({ val, label }) => (
                            <div key={label} className=" rounded-xl px-5 py-3.5 text-right min-w-[160px]">
                                <div className="text-[22px] font-black text-blue-400 leading-none">{val}</div>
                                <div className="text-[10px] text-slate-900 font-semibold uppercase tracking-wider mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    2. TRUST BAR
                ══════════════════════════════════════ */}
                <section className="bg-white border-b border-slate-100 shadow-sm relative z-10 -mt-12 md:-mt-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
                            {[
                                { icon: ShieldCheck, title: "GDP Compliant", sub: "Highest Standards" },
                                { icon: PackageCheck, title: "Licensed Wholesaler", sub: "Verified Sourcing" },
                                { icon: Globe2, title: "Global Shipping", sub: "Worldwide Access" },
                                { icon: Snowflake, title: "Cold-Chain Excellence", sub: "Temperature Control" },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title}
                                    className="flex items-center gap-4 px-6 py-7 group hover:bg-slate-50 transition-colors cursor-default">
                                    <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold text-slate-800 leading-tight">{title}</div>
                                        <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    3. HİZMETLER
                ══════════════════════════════════════ */}
                <section className="bg-slate-50 py-24 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">

                        {/* Başlık */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                            <div>
                                <SectionLabel>Our Comprehensive Solutions</SectionLabel>
                                <h2 className="font-extrabold text-slate-900 leading-tight"
                                    style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                                    What We Offer
                                </h2>
                            </div>
                            <p className="text-slate-500 text-[14px] leading-relaxed max-w-sm">
                                The pharmaceutical industry demands precision and speed. Our service pillars ensure life-saving treatments reach patients safely and on time.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    className="service-card bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group flex flex-col">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="service-icon h-13 w-13 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all duration-300 shadow-sm border border-blue-100">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    </div>
                                    <h4 className="font-extrabold text-[20px] text-slate-900 mb-3">{title}</h4>
                                    <p className="text-slate-500 text-[13.5px] leading-relaxed flex-1">{desc}</p>
                                    <div className="mt-6 flex items-center gap-1.5 text-blue-600 text-[13px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    4. KİMLERE HİZMET VERİYORUZ
                ══════════════════════════════════════ */}
                <section className="bg-white py-24 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                            {/* Sol metin */}
                            <div>
                                <SectionLabel>Who We Serve</SectionLabel>
                                <h2 className="font-extrabold text-slate-900 mb-6 leading-tight"
                                    style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                                    A Vital Link in<br />
                                    <span className="text-blue-600">Global Healthcare</span>
                                </h2>
                                <p className="text-slate-500 text-[14px] leading-relaxed mb-8 max-w-md">
                                    Our operations span international markets, serving a diverse clientele. We maintain rigorous oversight to ensure patient safety and product efficacy at every step.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "International GMP & GDP standards",
                                        "Cold-chain logistics expertise",
                                        "24/7 customs operations support",
                                        "Supply capacity in 50+ countries",
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-[13.5px] text-slate-600">
                                            <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/about"
                                    className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors">
                                    More About Us <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            {/* Sağ 2x2 grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Building2, title: "Hospitals", sub: "Public & Private" },
                                    { icon: TestTubes, title: "Research Institutions", sub: "R&D Centers" },
                                    { icon: Stethoscope, title: "Licensed Pharmacies", sub: "Verified Distribution" },
                                    { icon: Globe2, title: "Regional Distributors", sub: "Global Network" },
                                ].map(({ icon: Icon, title, sub }, i) => (
                                    <div key={title}
                                        className="group bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 rounded-2xl p-6 flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-md cursor-default">
                                        <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-600 text-blue-500 group-hover:text-white flex items-center justify-center shadow-sm transition-all duration-300">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-bold text-slate-800 leading-tight">{title}</div>
                                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    5. KÜRESEL LOJİSTİK (KOYU)
                ══════════════════════════════════════ */}
                <section className="relative bg-[#071525] py-28 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <SectionLabel>Global Operations</SectionLabel>
                            <h2 className="font-extrabold text-white mt-2 mb-4"
                                style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                                Global Pharmaceutical Logistics
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-[14px] leading-relaxed">
                                Navigating complex international regulations and customs procedures. Our strategic supply routes connect{" "}
                                <span className="text-blue-400 font-semibold">China to Southeast Asia, Europe, and beyond.</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                            {[
                                { val: "50+", label: "Countries Served", icon: Globe2 },
                                { val: "100%", label: "Cold-Chain Integrity", icon: Snowflake },
                                { val: "24/7", label: "Customs & Logistics Support", icon: Zap },
                            ].map(({ val, label, icon: Icon }) => (
                                <div key={label} className="stat-card rounded-2xl p-7 flex flex-col items-center text-center gap-3">
                                    <Icon className="h-6 w-6 text-blue-400/70" />
                                    <div className="text-[40px] font-black text-blue-400 leading-none">{val}</div>
                                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════
                    6. KALİTE & SERTİFİKALAR
                ══════════════════════════════════════ */}
                <section className="bg-slate-50 py-24 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                            {/* Sol: sertifika kartları */}
                            <div className="space-y-4">
                                {[
                                    { code: "GDP Certificate", full: "Good Distribution Practice Certified", issuer: "Ministry of Health" },
                                    { code: "Wholesale License", full: "Authorized Pharmaceutical Distributor", issuer: "General Directorate of Pharmaceuticals" },
                                    { code: "ISO 9001:2015", full: "Quality Management System Certificate", issuer: "TÜV Rheinland" },
                                ].map(({ code, full, issuer }) => (
                                    <div key={code}
                                        className="group bg-white rounded-xl border border-slate-200 hover:border-blue-200 p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-all cursor-default">
                                        <div className="h-14 w-12 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-blue-200 flex items-center justify-center shrink-0 transition-colors">
                                            <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-bold text-slate-800 leading-tight">{code}</div>
                                            <div className="text-[12px] text-slate-500 mt-0.5">{full}</div>
                                            <div className="text-[10px] text-blue-500/80 font-semibold mt-1 tracking-wide">{issuer}</div>
                                        </div>
                                        <Award className="h-5 w-5 text-slate-200 group-hover:text-blue-300 transition-colors shrink-0" />
                                    </div>
                                ))}
                            </div>

                            {/* Sağ metin */}
                            <div>
                                <SectionLabel>Our Quality Commitment</SectionLabel>
                                <h2 className="font-extrabold text-slate-900 mb-5 leading-tight"
                                    style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)" }}>
                                    Quality & Compliance:<br />
                                    <span className="text-blue-600">Our Core Priority</span>
                                </h2>
                                <p className="text-slate-500 text-[14px] leading-relaxed mb-6 max-w-md">
                                    Quality is the cornerstone of our company. We adhere to the highest international standards, verified by relevant health authorities.
                                </p>
                                <p className="text-slate-500 text-[14px] leading-relaxed mb-8 max-w-md">
                                    Every product is managed with rigorous oversight and cold-chain monitoring from procurement through final delivery.
                                </p>
                                <Link to="/quality"
                                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg text-[13px] font-bold transition-all shadow-md hover:-translate-y-0.5">
                                    View Our Quality Page <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </>
    );
}