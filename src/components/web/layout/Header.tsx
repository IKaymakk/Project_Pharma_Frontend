import { useState, useEffect } from "react";
import {
    Menu, X, ChevronRight, Phone, Sparkles,
    Mail, MapPin, Globe, ChevronDown, Shield
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Quality Policy", href: "/quality" },
    { label: "Contact", href: "/contact" },
];

export function Header() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // FIX: passive: true eklendi — scroll listener artık main thread'i bloklamıyor
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 36);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        // FIX: cleanup — component unmount'ta body overflow restore edilir
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => { setOpen(false); }, [pathname]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {/* ─────────────────────────────────────────
                1. TOP INFO BAR
            ───────────────────────────────────────── */}
            <div
                className={`fixed top-0 left-0 w-full z-[1000] bg-[#06111F] border-b border-white/5 text-[11px] transition-transform duration-500 ease-in-out ${scrolled ? "-translate-y-full" : "translate-y-0"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-9">
                        {/* LEFT */}
                        <div className="flex items-center divide-x divide-white/10">
                            <div className="hidden lg:flex items-center gap-2 pr-4 text-slate-400">
                                <MapPin className="h-3 w-3 text-blue-400/70" />
                                Gebze Technical University Technopark, Kocaeli / Turkey
                            </div>
                            <a
                                href="tel:+905555555555"
                                className="flex items-center gap-2 px-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <Phone className="h-3 w-3 text-blue-400/70" />
                                +90 (555) 555 55 55
                            </a>
                            <a
                                href="mailto:info@curipharma.com"
                                className="hidden sm:flex items-center gap-2 px-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <Mail className="h-3 w-3 text-blue-400/70" />
                                info@curipharma.com
                            </a>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center divide-x divide-white/10">
                            <div className="hidden md:flex items-center gap-3 px-4">
                                <Shield className="h-3 w-3 text-emerald-400/80" />
                                <div className="flex items-center gap-1.5">
                                    {["GMP", "GDP", "ISO 9001"].map((cert) => (
                                        <span
                                            key={cert}
                                            className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-sm border border-emerald-400/30 text-emerald-400/90 bg-emerald-500/10"
                                        >
                                            {cert}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-4 cursor-pointer hover:text-white text-slate-400 group">
                                <Globe className="h-3 w-3 group-hover:text-white transition-colors" />
                                <span className="font-semibold text-white">EN</span>
                                <span className="text-white/20">|</span>
                                <span className="hover:text-white">TR</span>
                                <ChevronDown className="h-3 w-3 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─────────────────────────────────────────
                2. NAVBAR (Floating Pill)
            ───────────────────────────────────────── */}
            <header
                className={`fixed left-0 w-full z-[999] transition-all duration-500 ease-in-out ${scrolled
                    ? "top-0 py-4 pointer-events-none"
                    : "top-[36px] py-0 bg-white/95 backdrop-blur-md "
                    }`}
            >
                <div
                    className={`mx-auto transition-all duration-500 ease-in-out pointer-events-auto ${scrolled
                        ? "max-w-[90%] md:max-w-4xl lg:max-w-5xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-4 lg:px-6"
                        : "max-w-7xl px-4 md:px-8 rounded-none"
                        }`}
                >
                    <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-[60px]" : "h-[76px]"}`}>

                        {/* LOGO */}
                        <Link to="/" className="flex items-center group relative z-10 shrink-0">
                            <img
                                src="https://i.hizliresim.com/mgjia0s.png"
                                alt="Curipharma"
                                className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-10" : "h-14 pt-1"}`}
                            />
                        </Link>

                        {/* DESKTOP NAV */}
                        <nav className="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                            {NAV_LINKS.map(({ label, href }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={href}
                                        to={href}
                                        className={`relative px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 ${active
                                            ? "bg-slate-100 text-blue-600 shadow-sm "
                                            : "text-black hover:bg-slate-50 hover:text-slate-500"
                                            }`}
                                    >
                                        {label}
                                        {active && (
                                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 bg-blue-600 rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* RIGHT SIDE (CTA) */}
                        <div className="hidden lg:flex items-center gap-4 shrink-0 relative z-10">
                            <Link
                                to="/contact"
                                className="shimmer-effect group relative inline-flex items-center gap-2 px-6 h-11 rounded-full text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_15px_rgb(37,99,235,0.3)] transition-all hover:-translate-y-0.5 active:scale-95 overflow-hidden"
                            >

                                <span className="relative z-20">Request Quote</span>
                                <ChevronRight className="h-4 w-4 relative z-20 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        {/* MOBILE BUTTON */}
                        <button
                            onClick={() => setOpen(true)}
                            aria-label="Open navigation menu"
                            className="lg:hidden relative z-10 flex items-center justify-center h-10 w-10 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                    </div>
                </div>
            </header>

            {/* ─────────────────────────────────────────
                3. MOBILE MENU (Slide-in)
            ───────────────────────────────────────── */}
            <div className={`fixed inset-0 z-[1001] lg:hidden transition-all duration-500 ${open ? "visible" : "invisible"}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />

                {/* Panel */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
                        <img
                            src="https://i.hizliresim.com/mgjia0s.png"
                            alt="Curipharma"
                            className="h-8 w-auto object-contain"
                        />
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close navigation menu"
                            className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className=" flex-1 px-4 py-6 space-y-2 overflow-y-auto relative">
                        {/* Başlık - relative ve z-20 ile shimmer'ın üstüne çıkardık */}
                        <div className="relative z-20 text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4 px-2">
                            Navigation
                        </div>

                        {NAV_LINKS.map(({ label, href }) => {
                            const active = isActive(href);
                            return (
                                <Link
                                    key={href}
                                    to={href}
                                    onClick={() => setOpen(false)}
                                    /* Linklerin kendisini de relative ve z-20 yaparak shimmer'ın metni yutmasını önledik */
                                    className={`relative z-20 flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all ${active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {label}
                                    <ChevronRight className={`h-4 w-4 ${active ? "opacity-100" : "opacity-40"}`} />
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-[12px] font-bold tracking-widest text-slate-400 uppercase">Contact Us</span>
                            <a
                                href="tel:+905555555555"
                                className="flex items-center gap-2 text-slate-700 font-bold hover:text-blue-600 transition-colors"
                            >
                                <Phone className="h-4 w-4 text-blue-500" />
                                +90 (555) 555 55 55
                            </a>
                        </div>
                        <Link
                            to="/contact"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                        >
                            Request Quote
                            <Sparkles className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* FIX: Keyframe ismi çakışmaları önlemek için yeniden adlandırıldı */}

        </>
    );
}