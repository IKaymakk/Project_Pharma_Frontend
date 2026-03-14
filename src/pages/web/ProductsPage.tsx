import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Search, Pill, Syringe, ShieldPlus,
    ChevronRight, Check, X, SlidersHorizontal,
    Activity, PackageX, Filter
} from "lucide-react";
import { productService } from "@/services/productService";
import { lookUpService } from "@/services/lookUpService";
import { toast } from "react-toastify";
import Lenis from "lenis";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Product {
    id: number;
    brandName: string;
    genericName: string;
    specification: string;
    imageUrl: string | null;
    categoryName: string;
    dosageFormName: string;
    categoryId: number;
    dosageFormId: number;
}
interface LookupItem { id: number; name: string; }

function normalizeProduct(r: any): Product {
    return {
        id: r.Id ?? r.id ?? 0,
        brandName: r.BrandName ?? r.brandName ?? "",
        genericName: r.GenericName ?? r.genericName ?? "",
        specification: r.Specification ?? r.specification ?? "",
        imageUrl: r.ImageUrl ?? r.imageUrl ?? null,
        categoryName: r.CategoryName ?? r.categoryName ?? "",
        dosageFormName: r.DosageFormName ?? r.dosageFormName ?? "",
        categoryId: r.CategoryId ?? r.categoryId ?? 0,
        dosageFormId: r.DosageFormId ?? r.dosageFormId ?? 0,
    };
}
function normalizeLookup(r: any): LookupItem {
    return { id: r.Id ?? r.id ?? 0, name: r.Name ?? r.name ?? "" };
}

function useDebounce<T>(value: T, delay = 280): T {
    const [d, setD] = useState<T>(value);
    useEffect(() => {
        const id = setTimeout(() => setD(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return d;
}


// ─────────────────────────────────────────────────────────────
// PRODUCT CARD — Premium redesign
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
    const [imgFailed, setImgFailed] = useState(false);
    const name = product.brandName || product.genericName;

    return (
        <Link
            to={`/contact?product=${encodeURIComponent(name)}`}
            className="pc-card group flex flex-col bg-white rounded-[1.25rem] border border-slate-200/70 overflow-hidden"
            style={{ animationDelay: `${(index % 6) * 60}ms` }}
        >
            {/* Image zone */}
            <div className="relative bg-gradient-to-b from-slate-50 to-white h-[180px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 pc-img-grid opacity-50 pointer-events-none" />
                <span className="absolute top-3 left-3 z-10 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500 bg-white border border-slate-200/80 px-2 py-1 rounded-md shadow-sm">
                    {product.categoryName || "General"}
                </span>
                {product.imageUrl && !imgFailed ? (
                    <img
                        src={`${product.imageUrl}`}
                        alt={name}
                        loading="lazy"
                        className="relative z-10 w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center opacity-[0.15]">
                        <Syringe className="h-10 w-10 text-slate-500" />
                    </div>
                )}
                <div className="pc-sweep absolute inset-0 pointer-events-none" />
            </div>

            {/* Content zone */}
            <div className="flex flex-col flex-1 p-5 border-t border-slate-100">
                <div className="mb-4 flex-1">
                    <h3
                        className="text-[15.5px] font-black text-slate-900 leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
                        title={name}
                    >
                        {name}
                    </h3>
                    {product.brandName && product.genericName && (
                        <p className="text-[11.5px] text-slate-400 font-medium line-clamp-1" title={product.genericName}>
                            {product.genericName}
                        </p>
                    )}
                </div>
                <dl className="border-t border-slate-100 pt-3.5 space-y-2">
                    {[
                        { label: "Specification", val: product.specification },
                        { label: "Dosage Form", val: product.dosageFormName },
                    ].map(({ label, val }) => (
                        <div key={label} className="flex items-center justify-between gap-3 text-[11.5px]">
                            <dt className="text-slate-400 font-medium shrink-0">{label}</dt>
                            <dd className="font-bold text-slate-700 text-right truncate max-w-[55%]">{val || "—"}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Inquire for pricing</span>
                    <div className="flex items-center gap-1 text-[11.5px] font-bold text-blue-600 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Request <ChevronRight className="h-3 w-3" />
                    </div>
                </div>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-400/60 group-hover:via-cyan-300/60 group-hover:to-blue-400/0 transition-all duration-500" />
        </Link>
    );
}

// ─────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-[1.25rem] border border-slate-200/70 overflow-hidden">
            <div className="h-[180px] skeleton" />
            <div className="p-5 border-t border-slate-100 space-y-3">
                <div className="h-4 skeleton rounded-md w-3/4" />
                <div className="h-3 skeleton rounded-md w-1/2" />
                <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                    <div className="h-3 skeleton rounded-md w-full" />
                    <div className="h-3 skeleton rounded-md w-4/5" />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// CHECK ITEM
// ─────────────────────────────────────────────────────────────
function CheckItem({ id, name, selected, onToggle }: {
    id: number; name: string; selected: boolean; onToggle: (id: number) => void;
}) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group py-[3px]">
            <div className={`h-[15px] w-[15px] rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${selected
                ? "bg-blue-600 border-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                : "border-slate-300 bg-white group-hover:border-blue-400"
                }`}>
                {selected && <Check className="h-[9px] w-[9px] text-white" strokeWidth={3.5} />}
            </div>
            <input type="checkbox" className="sr-only" checked={selected} onChange={() => onToggle(id)} />
            <span className={`text-[13px] leading-tight transition-colors select-none flex-1 ${selected ? "text-slate-900 font-semibold" : "text-slate-500 group-hover:text-slate-800"
                }`}>
                {name}
            </span>
        </label>
    );
}

// ─────────────────────────────────────────────────────────────
// FILTER SECTION BLOCK
// ─────────────────────────────────────────────────────────────
function FilterSection({ icon: Icon, title, count, children }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    count: number;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200/70 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-[0.14em]">{title}</span>
                </div>
                {count > 0 && (
                    <span className="h-4 min-w-[16px] px-1 rounded bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">
                        {count}
                    </span>
                )}
            </div>
            <div className="px-4 py-3 space-y-[2px] max-h-[260px] overflow-y-auto filter-scroll">
                {children}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────────────────────
function FilterPanel({ categories, dosageForms, selectedCategories, selectedForms, onCategoryToggle, onFormToggle, onClear, activeCount }: {
    categories: LookupItem[]; dosageForms: LookupItem[];
    selectedCategories: number[]; selectedForms: number[];
    onCategoryToggle: (id: number) => void; onFormToggle: (id: number) => void;
    onClear: () => void; activeCount: number;
}) {
    return (
        <div className="space-y-3">
            <FilterSection icon={ShieldPlus} title="Categories" count={selectedCategories.length}>
                {categories.map(c => (
                    <CheckItem key={c.id} id={c.id} name={c.name}
                        selected={selectedCategories.includes(c.id)} onToggle={onCategoryToggle} />
                ))}
            </FilterSection>
            <FilterSection icon={Pill} title="Dosage Forms" count={selectedForms.length}>
                {dosageForms.map(f => (
                    <CheckItem key={f.id} id={f.id} name={f.name}
                        selected={selectedForms.includes(f.id)} onToggle={onFormToggle} />
                ))}
            </FilterSection>
            {activeCount > 0 && (
                <button
                    onClick={onClear}
                    className="w-full py-2.5 text-[12px] font-bold text-slate-500 bg-white border border-slate-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50/40 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                    <X className="h-3 w-3" />
                    Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS FOR PARALLAX
// ─────────────────────────────────────────────────────────────
const PARALLAX_BG = 0.28;
const PARALLAX_TXT = 0.12;

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ProductsPage() {
    const heroBgRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<LookupItem[]>([]);
    const [dosageForms, setDosageForms] = useState<LookupItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedForms, setSelectedForms] = useState<number[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const [visibleCount, setVisibleCount] = useState(12);

    const debouncedQuery = useDebounce(searchQuery, 280);

    // ── Lenis smooth scroll + Parallax ──
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
        });

        // Setup global reference for drawer logic
        (window as any).__lenis = lenis;

        lenis.on("scroll", (e: { scroll: number }) => {
            const sy = e.scroll;
            if (heroBgRef.current) {
                heroBgRef.current.style.transform = `translateY(${sy * PARALLAX_BG}px)`;
            }
            if (heroContentRef.current) {
                heroContentRef.current.style.transform = `translateY(${sy * PARALLAX_TXT}px)`;
            }
        });

        let rafId: number;
        const raf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
        rafId = requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
            delete (window as any).__lenis;
        };
    }, []);

    // Drawer açıkken Lenis'i durdur (scroll arkada kaymasın)
    useEffect(() => {
        const lenis = (window as any).__lenis;
        if (!lenis) return;
        drawerOpen ? lenis.stop() : lenis.start();
    }, [drawerOpen]);

    useEffect(() => { setVisibleCount(12); }, [debouncedQuery, selectedCategories, selectedForms]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [pd, cd, fd] = await Promise.all([
                    productService.getAll("en"),
                    lookUpService.getCategories("en"),
                    lookUpService.getDosageForms("en"),
                ]);
                setProducts((pd as any[]).map(normalizeProduct));
                setCategories((cd as any[]).map(normalizeLookup));
                setDosageForms((fd as any[]).map(normalizeLookup));
            } catch (e) {
                console.error(e);
                toast.error("Failed to load product catalog.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleCategoryToggle = useCallback((id: number) =>
        setSelectedCategories(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id]), []);
    const handleFormToggle = useCallback((id: number) =>
        setSelectedForms(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]), []);
    const clearFilters = useCallback(() => {
        setSearchQuery(""); setSelectedCategories([]); setSelectedForms([]);
        searchRef.current?.focus();
    }, []);

    const filteredProducts = useMemo(() => {
        const q = debouncedQuery.toLowerCase().trim();
        return products.filter(p =>
            (q === "" || p.brandName.toLowerCase().includes(q) || p.genericName.toLowerCase().includes(q)) &&
            (selectedCategories.length === 0 || selectedCategories.includes(p.categoryId)) &&
            (selectedForms.length === 0 || selectedForms.includes(p.dosageFormId))
        );
    }, [products, debouncedQuery, selectedCategories, selectedForms]);

    const activeFilterCount = selectedCategories.length + selectedForms.length + (debouncedQuery ? 1 : 0);
    const fp = {
        categories, dosageForms, selectedCategories, selectedForms,
        onCategoryToggle: handleCategoryToggle, onFormToggle: handleFormToggle,
        onClear: clearFilters, activeCount: activeFilterCount,
    };

    return (
        <>
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
                .anim-1 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both 0.9s; }
                .anim-2 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both 1.05s; }
                .anim-3 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both 1.20s; }
                .anim-4 { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both 1.35s; }

                /* ── Hero grid ── */
                .hero-grid {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 44px 44px;
                }
                
                /* ── Noise ── */
                .noise {
                    position: absolute; inset: 0; pointer-events: none; opacity: 0.028;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                .pc-card { transition: all 0.28s cubic-bezier(.16,1,.3,1); animation: fadeUp 0.4s cubic-bezier(.16,1,.3,1) both; }
                .pc-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px -10px rgba(37,99,235,0.13); border-color: rgba(191,219,254,0.9); }
                .pc-img-grid { background-image: radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px); background-size: 18px 18px; }
                .pc-sweep { background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%); background-size: 200% 100%; background-position: -200% 0; }
                .pc-card:hover .pc-sweep { background-position: 200% 0; transition: background-position 0.55s ease; }
                .skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e8edf4 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                .drawer-backdrop { backdrop-filter: blur(8px); }
                .filter-scroll::-webkit-scrollbar { width: 3px; }
                .filter-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
            `}</style>

            <div className="bg-[#f4f6f9] min-h-screen">

                {/* ══════════════════════════════════════
                    1. HERO
                ══════════════════════════════════════ */}
                <div className="mt-8 relative bg-[#06111e] overflow-hidden min-h-[40vh] flex flex-col justify-end">

                    {/* Parallax Background */}
                    <div ref={heroBgRef} className="absolute inset-0 z-0" style={{ willChange: "transform" }}>
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600/0 via-blue-500 to-cyan-400/60 z-20" />

                        {/* Background Image */}
                        <img
                            src="/productshero.jpg"
                            alt="Product Catalog"
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                        />

                        {/* Glows and Grids */}
                        <div className="absolute inset-0 hero-grid pointer-events-none" />
                        <div className="absolute -top-20 left-1/3 w-[600px] h-[400px] bg-blue-700/15 rounded-full blur-[90px] pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-cyan-600/8 rounded-full blur-[60px] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06111e]/70 to-[#06111e]" />
                        <div className="noise" />
                    </div>

                    {/* Content */}
                    <div ref={heroContentRef} className="relative z-10 max-w-7xl w-full mx-auto px-4 md:px-8 pt-36 pb-28" style={{ willChange: "transform" }}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                            <div className="max-w-xl">
                                <div className="anim-1 inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                                    <Activity className="h-3 w-3 text-blue-400" />
                                    <span className="text-[10px] font-black tracking-[0.22em] uppercase text-blue-400">
                                        B2B Wholesale Catalog
                                    </span>
                                </div>
                                <h1
                                    className="anim-2 font-black text-white leading-[1.04] mb-4 tracking-tight"
                                    style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
                                >
                                    Product{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-black">
                                        Catalog
                                    </span>
                                </h1>
                                <p className="anim-3 text-slate-400 text-[15px] font-light leading-[1.7] max-w-md">
                                    GMP-certified pharmaceuticals sourced from verified global manufacturers.
                                    Use the filters to find exactly what you need.
                                </p>
                            </div>

                            {!loading && (
                                <div className="anim-4 flex items-stretch gap-0 shrink-0 rounded-xl overflow-hidden bg-white/3 backdrop-blur-sm border border-white/10 divide-x divide-white/10">
                                    {[
                                        { n: products.length, label: "Products" },
                                        { n: categories.length, label: "Categories" },
                                    ].map(({ n, label }) => (
                                        <div key={label} className="flex flex-col items-center justify-center px-7 py-4">
                                            <span className="text-[24px] font-black text-white tabular-nums leading-none mb-1">{n}</span>
                                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ══ SEARCH BRIDGE ══ */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-[26px] relative z-30">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] p-3 flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-slate-400 pointer-events-none" />
                            <input
                                ref={searchRef}
                                type="text"
                                aria-label="Search products by brand or generic name"
                                placeholder="Search by brand or generic name…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50/60 border border-slate-200/70 text-slate-800 text-[13.5px] font-medium rounded-xl pl-10 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/70 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="lg:hidden relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        {!loading && (
                            <div className="hidden sm:flex items-center gap-2 text-[13px] shrink-0 pl-3 border-l border-slate-200">
                                <span className="font-black text-slate-900">{filteredProducts.length}</span>
                                <span className="text-slate-400">result{filteredProducts.length !== 1 ? "s" : ""}</span>
                                {activeFilterCount > 0 && (
                                    <span className="bg-blue-50 text-blue-600 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-200/70">
                                        {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ MAIN CONTENT ══ */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[88px] self-start">
                            <FilterPanel {...fp} />
                        </aside>

                        <main className="flex-1 w-full min-w-0">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-28 flex flex-col items-center text-center px-8">
                                    <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center mb-5 border border-slate-100">
                                        <PackageX className="h-6 w-6 text-slate-300" />
                                    </div>
                                    <h3 className="font-black text-[18px] text-slate-800 mb-2">No products found</h3>
                                    <p className="text-slate-400 text-[13.5px] max-w-xs mb-7 font-light leading-relaxed">
                                        Try removing some filters or adjusting your search term.
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {filteredProducts.slice(0, visibleCount).map((p, i) => (
                                            <ProductCard key={p.id} product={p} index={i} />
                                        ))}
                                    </div>
                                    {visibleCount < filteredProducts.length && (
                                        <div className="flex justify-center mt-10">
                                            <button
                                                onClick={() => setVisibleCount(v => v + 12)}
                                                className="px-8 py-3 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                            >
                                                Load More Products
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                </div>

                {/* ══ MOBILE DRAWER ══ */}
                {drawerOpen && (
                    <div className="fixed inset-0 z-[600] lg:hidden">
                        <div
                            className="absolute inset-0 bg-slate-900/60 drawer-backdrop"
                            onClick={() => setDrawerOpen(false)}
                        />
                        <div className="drawer-panel absolute right-0 top-0 bottom-0 w-[88%] max-w-[320px] bg-[#f4f6f9] flex flex-col shadow-2xl">
                            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <Filter className="h-4 w-4 text-blue-600" />
                                    <span className="font-black text-[14px] text-slate-900">Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <FilterPanel {...fp} />
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100">
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[13px] font-bold transition-colors"
                                >
                                    Show {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}