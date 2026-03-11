import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Quality Policy", href: "/quality" },
    { label: "Contact", href: "/contact" },
];

export function Navbar() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
    }, [open]);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-md"
                : "bg-white border-b border-slate-100"
                }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between h-[76px]">

                        {/* LOGO */}
                        <Link to="/" className="flex items-center group ">
                            <img
                                src="https://i.hizliresim.com/mgjia0s.png"
                                alt="Curipharma"
                                className="h-14 pt-1  w-auto object-contain"
                            />
                        </Link>

                        {/* DESKTOP NAV */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_LINKS.map(({ label, href }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={href}
                                        to={href}
                                        className={`relative px-4 py-2.5 text-[13px] font-semibold transition-colors ${active
                                            ? "text-blue-600"
                                            : "text-slate-600 hover:text-slate-900"
                                            }`}
                                    >
                                        {label}
                                        <span className={`absolute left-3 right-3 -bottom-1 h-[2px] rounded-full transition-all duration-300 ${active
                                            ? "bg-blue-600 scale-x-100"
                                            : "bg-slate-300 scale-x-0 group-hover:scale-x-100"
                                            }`} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* RIGHT SIDE */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="h-6 w-px bg-slate-200" />
                            <Link
                                to="/contact"
                                className="flex items-center gap-2 px-5 h-9 rounded-lg text-[13px] font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
                            >
                                Request Quote
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* MOBILE BUTTON */}
                        <button
                            onClick={() => setOpen(true)}
                            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200"
                        >
                            <Menu className="h-5 w-5 text-slate-600" />
                        </button>

                    </div>
                </div>
            </header>

            {/* MOBILE MENU */}
            {open && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">

                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <img
                                src="https://i.hizliresim.com/rpj1u3x.jpeg"
                                alt="Curipharma"
                                className="h-8 w-auto object-contain"
                            />
                            <button
                                onClick={() => setOpen(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {NAV_LINKS.map(({ label, href }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={href}
                                        to={href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-[14px] font-semibold ${active
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {label}
                                        <ChevronRight className="h-4 w-4 opacity-60" />
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t space-y-3">
                            <a
                                href="tel:+905555555555"
                                className="flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-semibold text-slate-600"
                            >
                                <Phone className="h-4 w-4 text-blue-500" />
                                +90 (555) 555 55 55
                            </a>
                            <Link
                                to="/contact"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-blue-600 text-white font-bold"
                            >
                                Request Quote
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}