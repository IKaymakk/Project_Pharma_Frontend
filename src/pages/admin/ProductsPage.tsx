import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";
import { DataTable } from "@/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { CreateProductDialog } from "@/components/admin/products/CreateProductDialog";
import {
    Pencil, Trash2, Plus, FileSpreadsheet, RefreshCw, Eye,
    Search, ChevronRight, Package, Tag, Layers,
    SlidersHorizontal, Download, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { EditProductDialog } from "@/components/admin/products/EditProductDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const filtered = products.filter(p =>
        !search ||
        p.BrandName?.toLowerCase().includes(search.toLowerCase()) ||
        p.GenericName?.toLowerCase().includes(search.toLowerCase()) ||
        p.CategoryName?.toLowerCase().includes(search.toLowerCase())
    );

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await productService.delete(deleteId); // Backend: Soft Delete
            toast.success("İşlem Başarılı", {
                position: "top-right",
                autoClose: 4000,
            }); fetchProducts();
        } catch (error) {

            toast.error("Hata Oluştu", {
                position: "top-right",
                autoClose: 4000
            });

        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };
    const columns: ColumnDef<Product>[] = [
        {
            id: "rowNo",
            header: () => <span className="text-[10px] font-semibold text-slate-700 tabular-nums">#</span>,
            cell: ({ row }) => (
                <span className="text-[10px] text-slate-400 tabular-nums select-none">{row.index + 1}</span>
            ),
            size: 32,
        },
        {
            accessorKey: "BrandName",
            header: () => <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Marka Adı</span>,
            cell: ({ row }) => (
                <span className=" text-[11px] text-slate-800 leading-tight">{row.getValue("BrandName")}</span>
            ),
        },
        {
            accessorKey: "GenericName",
            header: () => <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Etken Madde</span>,
            cell: ({ row }) => (
                <span className="text-[11px] text-slate-600">{row.getValue("GenericName")}</span>
            ),
        },
        {
            accessorKey: "CategoryName",
            header: () => <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Kategori</span>,
            cell: ({ row }) => {
                const val = row.getValue("CategoryName") as string;
                return val ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {val}
                    </span>
                ) : <span className="text-slate-300">—</span>;
            },
        },
        {
            accessorKey: "DosageFormName",
            header: () => <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Form</span>,
            cell: ({ row }) => (
                <span className="text-[11px] text-slate-500">{row.getValue("DosageFormName") || "—"}</span>
            ),
        },
        {
            accessorKey: "Specification",
            header: () => <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">Özellik</span>,
            cell: ({ row }) => (
                <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {row.getValue("Specification") || "—"}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider sr-only">İşlem</span>,
            cell: ({ row }) => (
                <div className="flex justify-end items-center gap-0.5 opacity-1 group-hover:opacity-100 transition-opacity duration-100">
                    <Button variant="ghost" size="icon"
                        className="h-6 w-6 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Görüntüle">
                        <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon"
                        className="..."
                        onClick={() => setEditingId(row.original.Id)}
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon"
                        className="h-6 w-6 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Sil"
                        onClick={() => setDeleteId(row.original.Id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon"
                        className="h-6 w-6 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Daha Fazla">
                        <MoreHorizontal className="h-3 w-3" />
                    </Button>
                </div>
            ),
            size: 100,
        },
    ];

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll("tr");
            setProducts(data);
        } catch {
            toast.error("Veriler Yüklenemediz", { position: "top-right" });
        }
    };
    const handleExport = async () => {
        try {
            await productService.exportToExcel("tr");
            toast.success("Excel İndirildi", { position: "top-right" });
        } catch {
            toast.error("İndirme Başarısız", { position: "top-right" });
        }
    };


    useEffect(() => { fetchProducts(); }, []);

    /* ── KPI hesapları ── */
    const categories = new Set(products.map(p => p.CategoryName)).size;
    const brands = new Set(products.map(p => p.BrandName)).size;

    return (
        <div className="flex flex-col h-full gap-0 font-[system-ui]">

            {/* ── BREADCRUMB ── */}
            <div className="flex items-center gap-1 px-4 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-400 select-none">
                <span className="hover:text-slate-600 cursor-pointer">Ana Sayfa</span>
                <ChevronRight className="h-2.5 w-2.5" />
                <span className="hover:text-slate-600 cursor-pointer">Stok Yönetimi</span>
                <ChevronRight className="h-2.5 w-2.5" />
                <span className="text-slate-700 font-medium">Ürün Listesi</span>
            </div>

            {/* ── PAGE HEADER ── */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-inner">
                        <Package className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[13px] font-bold text-slate-800 leading-none">Ürün Listesi</h1>
                        <p className="text-[10px] text-slate-400 mt-0.5">Stok Yönetimi › Ürünler</p>
                    </div>
                </div>

                {/* Sağ aksiyonlar */}
                <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm"
                        className="h-7 px-2.5 text-[11px] text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        onClick={fetchProducts}>
                        <RefreshCw className="mr-1.5 h-3 w-3" /> Yenile
                    </Button>
                    <div className="w-px h-4 bg-slate-200" />
                    <Button variant="ghost" size="sm" onClick={handleExport} className="...">
                        <Download className="mr-1.5 h-3 w-3" /> Excel
                    </Button>
                    {/* Modal Bileşeni - Butonu kendi içinde barındırır */}
                    <CreateProductDialog onSuccess={fetchProducts} />
                </div>
            </div>

            {/* ── KPI BAR ── */}
            <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-white">
                {[
                    { label: "Toplam Ürün", value: products.length, icon: Package, color: "text-slate-700" },
                    { label: "Kategori", value: categories, icon: Layers, color: "text-blue-600" },
                    { label: "Marka", value: brands, icon: Tag, color: "text-violet-600" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-2.5 px-4 py-2">
                        <Icon className={`h-4 w-4 ${color} shrink-0`} />
                        <div>
                            <div className={`text-[15px] font-bold tabular-nums leading-none ${color}`}>{value}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
                        </div>
                    </div>
                ))}
            </div>


            {/* ── TABLO ── */}
            <div className="flex-1 overflow-auto bg-white">
                <style>{`
                    /* ERP tablo stili — zebra + hover + compact */
                    [data-erp-table] table { width: 100%; border-collapse: collapse; }
                    [data-erp-table] thead tr {
                        background: #f8fafc;
                        border-bottom: 2px solid #e2e8f0;
                        position: sticky; top: 0; z-index: 1;
                    }
                    [data-erp-table] thead th {
                        padding: 6px 10px;
                        text-align: left;
                        white-space: nowrap;
                        border-right: 1px solid #f1f5f9;
                        user-select: none;
                    }
                    [data-erp-table] thead th:last-child { border-right: none; }
                    [data-erp-table] tbody tr {
                        border-bottom: 1px solid #f1f5f9;
                        transition: background 0.08s;
                    }
                    [data-erp-table] tbody tr:nth-child(even) { background: #fafafa; }
                    [data-erp-table] tbody tr:hover { background: #eff6ff !important; }
                    [data-erp-table] tbody tr { cursor: pointer; }
                    [data-erp-table] tbody tr td {
                        padding: 1px 10px;
                        vertical-align: middle;
                    }
                    [data-erp-table] tbody tr:hover td { border-color: #bfdbfe; }
                `}</style>
                <div data-erp-table="">
                    <DataTable
                        columns={columns}
                        data={filtered}
                    />
                </div>
            </div>

            {/* ── STATUS BAR ── */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 select-none shrink-0">
                <div className="flex items-center gap-3">
                    <span>
                        <span className="font-semibold text-slate-600">{filtered.length}</span> kayıt gösteriliyor
                        {search && <span className="ml-1">(toplam {products.length} kayıttan filtrelendi)</span>}
                    </span>
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-blue-500 hover:text-blue-700 underline"
                        >
                            Filtreyi temizle
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                        Bağlı
                    </span>
                    <span>Son güncelleme: {new Date().toLocaleTimeString("tr-TR")}</span>
                </div>
            </div>
            <EditProductDialog
                productId={editingId}
                open={!!editingId}
                onOpenChange={(isOpen) => !isOpen && setEditingId(null)}
                onSuccess={fetchProducts}
            />
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-white border-slate-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-800">Ürünü silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 text-xs">
                            Bu işlem ürünü listeden kaldıracak ve pasife çekecektir.
                            Daha sonra sistem yöneticisi tarafından geri alınabilir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-8 text-xs text-slate-500 border-slate-200 hover:bg-slate-50">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
                            className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white border-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

    );

}