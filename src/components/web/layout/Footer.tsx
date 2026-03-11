import { Hexagon, Mail, MapPin, Phone, ArrowRight, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_LINKS = [
    { label: "About Us", href: "/about" },
    { label: "All Products", href: "/products" },
    { label: "Quality Certificates", href: "/quality" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "#" },
];

const CATEGORIES = [
    { label: "Oncology Drugs", href: "/products" },
    { label: "Rare Diseases", href: "/products" },
    { label: "Vaccines & Sera", href: "/products" },
    { label: "Generic Medicines", href: "/products" },
    { label: "OTC Products", href: "/products" },
];

const CERTIFICATIONS = [
    { code: "GMP", full: "Good Manufacturing Practice" },
    { code: "GDP", full: "Good Distribution Practice" },
    { code: "ISO 9001", full: "Quality Management System" },
];

export function Footer() {
    return (
        <footer className="bg-[#071525] text-slate-400 relative overflow-hidden">

            {/* Decorative background light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/[0.04] rounded-full blur-3xl pointer-events-none" />

            {/* ── Top CTA Band ── */}
            <div className="border-b border-white/[0.06] relative">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-[20px] font-black text-white tracking-tight">
                            Strengthen your supply chain.
                        </h3>
                        <p className="text-[13px] text-slate-500 mt-1">
                            Get a quote now for GMP & GDP certified products.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <a href="tel:+905555555555"
                            className="flex items-center gap-2 h-10 px-5 rounded-lg border border-white/10 text-[13px] font-semibold text-slate-300 hover:border-white/20 hover:text-white hover:bg-white/[0.04] transition-all">
                            <Phone className="h-3.5 w-3.5 text-blue-400" />
                            Call Now
                        </a>
                        <Link to="/contact"
                            className="flex items-center gap-2 h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-bold shadow-lg shadow-blue-600/25 hover:-translate-y-px transition-all">
                            Request Quote <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

                    {/* Column 1: Brand (4/12) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group select-none w-fit">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20">
                                <Hexagon className="h-5 w-5" strokeWidth={2.5} />
                            </div>
                            <div className="leading-none">
                                <span className="block text-[20px] font-black text-white tracking-tight">
                                    Curi<span className="text-blue-500">pharma</span>
                                </span>
                                <span className="block text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase mt-0.5">
                                    Medicine Wholesaler
                                </span>
                            </div>
                        </Link>

                        <p className="text-[12.5px] text-slate-500 leading-relaxed max-w-xs">
                            Your reliable partner in GMP & GDP compliant medical supply and pharmaceutical wholesale services at international standards.
                        </p>

                        {/* Contact Info */}
                        <ul className="space-y-3">
                            {[
                                { icon: MapPin, text: "Gebze Technical University Technopark, Kocaeli / Turkey", href: "#" },
                                { icon: Phone, text: "+90 (555) 555 55 55", href: "tel:+905555555555" },
                                { icon: Mail, text: "info@curipharma.com", href: "mailto:info@curipharma.com" },
                            ].map(({ icon: Icon, text, href }) => (
                                <li key={text}>
                                    <a href={href}
                                        className="flex items-start gap-2.5 text-[12px] text-slate-500 hover:text-slate-200 transition-colors group">
                                        <Icon className="h-3.5 w-3.5 text-blue-500/60 shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                                        {text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Quick Links (2/12) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.18em] mb-5">Company</h4>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link to={href}
                                        className="flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-white transition-colors group">
                                        <ArrowRight className="h-2.5 w-2.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-blue-400 shrink-0" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Categories (2/12) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.18em] mb-5">Product Categories</h4>
                        <ul className="space-y-3">
                            {CATEGORIES.map(({ label, href }) => (
                                <li key={label}>
                                    <Link to={href}
                                        className="flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-white transition-colors group">
                                        <ArrowRight className="h-2.5 w-2.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-blue-400 shrink-0" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Certifications + Newsletter (4/12) */}
                    <div className="lg:col-span-4 space-y-7">

                        {/* Certifications */}
                        <div>
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.18em] mb-4">Our Certificates</h4>
                            <div className="space-y-2">
                                {CERTIFICATIONS.map(({ code, full }) => (
                                    <div key={code}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-colors group">
                                        <Shield className="h-3.5 w-3.5 text-emerald-400/70 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-black text-emerald-400 tracking-wider">{code}</span>
                                            <span className="mx-2 text-white/10">·</span>
                                            <span className="text-[11px] text-slate-500">{full}</span>
                                        </div>
                                        <ExternalLink className="h-3 w-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.18em] mb-1.5">Subscribe to Newsletter</h4>
                            <p className="text-[11px] text-slate-600 mb-3">For new products and industry updates.</p>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Your email address"
                                    className="h-9 flex-1 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-600 text-[12px] focus-visible:ring-blue-500 focus-visible:border-blue-500/50 rounded-lg"
                                />
                                <Button className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold rounded-lg shadow-md shadow-blue-600/20 shrink-0 transition-all">
                                    Subscribe
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Bottom Line ── */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[11px] text-slate-600">
                        © {new Date().getFullYear()} Curipharma Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5 text-[11px]">
                        <Link to="#" className="text-slate-600 hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <span className="text-white/10">|</span>
                        <Link to="#" className="text-slate-600 hover:text-slate-300 transition-colors">Terms of Use</Link>
                        <span className="text-white/10">|</span>
                        <Link to="#" className="text-slate-600 hover:text-slate-300 transition-colors">Data Protection</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}