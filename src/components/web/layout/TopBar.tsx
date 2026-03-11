import { Mail, Phone, MapPin, Globe, ChevronDown, Shield } from "lucide-react";

export function TopBar() {
    return (
        <div className="w-full bg-[#06111F] border-b border-white/5 text-[11px]">
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
                                {["GMP", "GDP", "ISO 9001"].map(cert => (
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
    );
}