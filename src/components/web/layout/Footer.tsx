import { Mail, MapPin, Phone, ArrowRight, Shield, ExternalLink, ChevronRight, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_LINKS = [
    { label: "About Us", href: "/about" },
    { label: "Our Operations", href: "/about#operations" },
    { label: "Quality Standards", href: "/quality" },
    { label: "Partner With Us", href: "/contact" },
    { label: "Career Opportunities", href: "#" },
];

const CATEGORIES = [
    { label: "Original Brand Medicinals", href: "/products" },
    { label: "Generic Pharmaceuticals", href: "/products" },
    { label: "Oncology & Rare Diseases", href: "/products" },
    { label: "Cold-Chain Supplies", href: "/products" },
    { label: "Medical Consumables", href: "/products" },
];

const CERTIFICATIONS = [
    { code: "GDP", full: "Good Distribution Practice" },
    { code: "Wholesale", full: "Ministry of Health Licensed" },
    { code: "ISO 9001", full: "Quality Management System" },
];

export function Footer() {
    return (
        <footer className="bg-[#040b14] text-slate-400 relative overflow-hidden font-body">

            {/* ── AMBIENT BACKGROUND LIGHTS ── */}
            {/* Üst çizgiden süzülen ince mavi ışık */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] max-w-lg h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-[2px]" />

            {/* Devasa Arkaplan Küreleri (Derinlik hissi için) */}
            <div className="absolute -top-[300px] -right-[100px] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-[200px] -left-[100px] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ── TOP CTA BAND ── */}
            <div className="relative border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-cyan-400">Ready to Ship Globally</span>
                        </div>
                        <h3 className="text-[26px] md:text-[32px] font-black text-white leading-tight">
                            Strengthen Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Supply Chain.</span>
                        </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
                        <a href="tel:+905555555555"
                            className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-white/10 text-[14px] font-bold text-slate-300 hover:border-blue-500/50 hover:text-white bg-white/[0.02] hover:bg-blue-500/10 transition-all w-full sm:w-auto group">
                            <Phone className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            +90 555 555 5555
                        </a>

                        <Link to="/contact"
                            className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgb(37,99,235,0.2)] hover:shadow-[0_0_30px_rgb(37,99,235,0.4)] transition-all hover:-translate-y-1 overflow-hidden w-full sm:w-auto">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />
                            Request a Quote
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-16">

                    {/* Column 1: Brand (4/12) */}
                    <div className="lg:col-span-4 flex flex-col">
                        <Link to="/" className="inline-block mb-6">
                            <img
                                src="https://i.hizliresim.com/mgjia0s.png"
                                alt="Curipharma"
                                className="h-12 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </Link>

                        <p className="text-[14px] text-slate-400 leading-relaxed mb-8 pr-4 font-light">
                            Your reliable partner in <strong className="text-slate-300 font-medium">GMP & GDP compliant</strong> medical supply and pharmaceutical wholesale services at international standards.
                        </p>

                        <ul className="space-y-4 mt-auto">
                            {[
                                { icon: MapPin, text: "Gebze Tech. Univ. Technopark, Kocaeli / TR", href: "#" },
                                { icon: Mail, text: "info@curipharma.com", href: "mailto:info@curipharma.com" },
                            ].map(({ icon: Icon, text, href }) => (
                                <li key={text}>
                                    <a href={href}
                                        className="flex items-start gap-3 text-[13px] text-slate-400 hover:text-white transition-colors group w-fit">
                                        <div className="mt-0.5 p-1.5 rounded-md bg-white/5 border border-white/5 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                                            <Icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <span className="mt-1.5">{text}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Quick Links (2/12) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="w-2 h-px bg-blue-500"></span> Company
                        </h4>
                        <ul className="space-y-3.5">
                            {QUICK_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link to={href}
                                        className="inline-flex items-center text-[13.5px] font-medium text-slate-400 hover:text-blue-400 transition-colors group">
                                        <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500" />
                                        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Categories (3/12) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="w-2 h-px bg-blue-500"></span> Specialties
                        </h4>
                        <ul className="space-y-3.5">
                            {CATEGORIES.map(({ label, href }) => (
                                <li key={label}>
                                    <Link to={href}
                                        className="inline-flex items-center text-[13.5px] font-medium text-slate-400 hover:text-blue-400 transition-colors group">
                                        <ChevronRight className="h-3.5 w-3.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500" />
                                        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Certs (3/12) */}
                    <div className="lg:col-span-3 flex flex-col">

                        <div className="mb-10">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Globe2 className="h-4 w-4 text-blue-500" /> Global Updates
                            </h4>
                            <p className="text-[12.5px] text-slate-500 mb-4 font-light">Join our network for industry insights and product updates.</p>

                            <div className="flex relative">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-11 w-full bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 text-[13px] focus-visible:ring-blue-500 focus-visible:border-blue-500/50 rounded-xl pr-28 transition-colors"
                                />
                                <Button className="absolute right-1 top-1 bottom-1 h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-bold rounded-lg transition-colors">
                                    Subscribe
                                </Button>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                {CERTIFICATIONS.map(({ code }) => (
                                    <div key={code} className="flex items-center justify-center h-8 px-3 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-slate-300 tracking-wider">
                                        <Shield className="h-3 w-3 mr-1.5 text-slate-500" /> {code}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── BOTTOM LINE ── */}
            <div className="relative border-t border-white/[0.04] bg-[#02060c]/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[12px] text-slate-600 font-medium">
                        © {new Date().getFullYear()} Curipharma Logistics. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[12px] font-medium">
                        <Link to="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <span className="h-3 w-px bg-white/10" />
                        <Link to="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>

        </footer>
    );
}