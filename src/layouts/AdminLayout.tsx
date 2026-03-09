import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    LayoutDashboard, Package, Users, Settings, LogOut,
    Menu, ChevronLeft, ChevronRight, Bell, HelpCircle, Layers, Tablets
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CategoryManagerDialog } from "@/components/admin/categories/CategoryManagerDialog";
import { DosageFormManagerDialog } from "@/components/admin/dosageForms/DosageFormManagerDialog";

// Tip Tanımlaması
type SidebarItem =
    | { name: string; href: string; icon: LucideIcon; isModal?: never; modalKey?: never }
    | { name: string; href?: never; icon: LucideIcon; isModal: true; modalKey: string };

// 1️⃣ LİSTEYE DOZAJ FORMUNU EKLEDİK
const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Ürün Yönetimi", href: "/admin/products", icon: Package },
    { name: "Kategoriler", icon: Layers, isModal: true, modalKey: "category" },
    { name: "Dozaj Formları", icon: Tablets, isModal: true, modalKey: "dosage" }, // ✅ YENİ EKLENDİ
    { name: "Kullanıcılar", href: "/admin/users", icon: Users },
    { name: "Ayarlar", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // State'ler
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isDosageModalOpen, setDosageModalOpen] = useState(false);

    // 2️⃣ HANDLER FONKSİYONUNU GÜNCELLEDİK
    const handleModalItem = (modalKey: string) => {
        if (modalKey === "category") setCategoryModalOpen(true);
        if (modalKey === "dosage") setDosageModalOpen(true); // ✅ YENİ EKLENDİ
    };

    return (
        <div className="flex h-screen overflow-hidden" style={{ fontFamily: "system-ui, sans-serif", background: "#f1f5f9" }}>

            {/* ── SIDEBAR ── */}
            <aside className={cn(
                "hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out z-20 shrink-0",
                collapsed ? "w-[52px]" : "w-[200px]"
            )}>

                {/* LOGO */}
                <div className={cn(
                    "flex h-[42px] items-center border-b border-slate-200 shrink-0 overflow-hidden",
                    collapsed ? "justify-center px-0" : "px-3 gap-2"
                )}>
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-inner">
                        P
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                            Pharma<span className="text-slate-400 font-medium">ERP</span>
                        </span>
                    )}
                </div>

                {/* MENÜ LABEL */}
                {!collapsed && (
                    <div className="px-3 pt-3 pb-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Navigasyon</span>
                    </div>
                )}

                {/* NAV (BURASI OTOMATİK OLARAK YENİ BUTONU RENDER EDER) */}
                <nav className="flex-1 px-1.5 space-y-0.5 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = !item.isModal && (
                            location.pathname === item.href ||
                            (item.href !== "/admin" && location.pathname.startsWith(item.href))
                        );

                        const sharedClass = cn(
                            "relative flex items-center gap-2.5 rounded px-2 py-1.5 text-[12.5px] font-medium transition-all duration-100 group select-none w-full",
                            isActive
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800",
                            collapsed && "justify-center px-0"
                        );

                        const iconClass = cn(
                            "h-3.5 w-3.5 shrink-0",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                        );

                        const inner = (
                            <>
                                <item.icon className={iconClass} />
                                {!collapsed && <span className="truncate">{item.name}</span>}
                                {collapsed && (
                                    <div className="pointer-events-none absolute left-[46px] hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
                                        {item.name}
                                    </div>
                                )}
                            </>
                        );

                        if (item.isModal) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleModalItem(item.modalKey)}
                                    title={collapsed ? item.name : undefined}
                                    className={sharedClass}
                                >
                                    {inner}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                title={collapsed ? item.name : undefined}
                                className={sharedClass}
                            >
                                {inner}
                            </Link>
                        );
                    })}
                </nav>

                {/* ALT BÖLÜM */}
                <div className="border-t border-slate-200 bg-slate-50/60 px-1.5 py-2 space-y-0.5 shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "w-full h-6 text-slate-400 hover:bg-white hover:text-slate-600 hover:shadow-sm transition-all",
                            collapsed ? "justify-center px-0" : "justify-start px-2 text-xs gap-1.5"
                        )}
                    >
                        {collapsed
                            ? <ChevronRight className="h-3 w-3" />
                            : <><ChevronLeft className="h-3 w-3" /><span>Daralt</span></>
                        }
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "w-full h-6 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 transition-all",
                            collapsed ? "justify-center px-0" : "justify-start px-2 gap-1.5"
                        )}
                    >
                        <LogOut className="h-3 w-3 shrink-0" />
                        {!collapsed && "Çıkış Yap"}
                    </Button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <header className="flex h-[42px] items-center justify-between border-b border-slate-200 bg-white px-4 shrink-0 z-10">
                    <Button variant="ghost" size="icon" className="md:hidden h-7 w-7 text-slate-500">
                        <Menu className="h-4 w-4" />
                    </Button>
                    <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded relative"
                            title="Bildirimler">
                            <Bell className="h-3.5 w-3.5" />
                            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                        </Button>
                        <Button variant="ghost" size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            title="Yardım">
                            <HelpCircle className="h-3.5 w-3.5" />
                        </Button>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
                            <div className="text-right hidden sm:block leading-none">
                                <span className="block text-[11px] font-bold text-slate-700 group-hover:text-slate-900">İbrahim Bey</span>
                                <span className="block text-[9px] text-slate-400">Yönetici</span>
                            </div>
                            <div className="h-7 w-7 rounded border border-slate-200 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                IB
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-3 bg-slate-100/70">
                    <Outlet />
                </main>
            </div>

            {/* MODALLAR */}
            <CategoryManagerDialog
                open={isCategoryModalOpen}
                onOpenChange={setCategoryModalOpen}
            />
            {/* 3️⃣ DOZAJ MODALINI RENDER ETTİK */}
            <DosageFormManagerDialog
                open={isDosageModalOpen}
                onOpenChange={setDosageModalOpen}
            />
        </div>
    );
}