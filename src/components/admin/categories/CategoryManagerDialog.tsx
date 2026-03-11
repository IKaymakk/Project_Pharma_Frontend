import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { categoryService, type CategoryDto } from "@/services/categoryService";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Save, Trash2, Pencil,  Layers } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CategoryManagerDialog({ open, onOpenChange }: Props) {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: "" });
    const [editingId, setEditingId] = useState<number | null>(null);

    // Silme Dialog State
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Verileri Çek
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll("tr");
            setCategories(data);
        } catch {
            toast.error("Kategoriler yüklenemedi", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchCategories();
    }, [open]);

    // Kaydet veya Güncelle
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.warning("Lütfen tüm alanları doldurun", { position: "top-right" });
            return;
        }

        setSubmitting(true);
        try {
            if (editingId) {
                // GÜNCELLEME
                await categoryService.update(editingId, formData.name, "tr");
                toast.success("Kategori Güncellendi", { position: "top-right", autoClose: 2000 });
            } else {
                // EKLEME
                await categoryService.create(formData.name, "tr");
                toast.success("Kategori Eklendi", { position: "top-right", autoClose: 2000 });
            }

            // Formu Temizle ve Listeyi Yenile
            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error("İşlem Başarısız", { position: "top-right" });
        } finally {
            setSubmitting(false);
        }
    };

    // Silme İşlemi
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await categoryService.delete(deleteId);
            toast.success("Kategori Silindi", { position: "top-right", autoClose: 2000 });
            fetchCategories();
        } catch {
            toast.error("Silme Başarısız", { position: "top-right" });
        } finally {
            setDeleteId(null);
        }
    };

    // Düzenleme Moduna Geç
    const startEdit = (cat: CategoryDto) => {
        setFormData({ name: cat.name || "" }); // Backend DTO property isimlerine dikkat (PascalCase/camelCase)
        setEditingId(cat.id);
    };

    const resetForm = () => {
        setFormData({ name: "" });
        setEditingId(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white p-0 gap-0 overflow-hidden border-slate-200">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Layers className="h-4 w-4" />
                        </div>
                        Kategori Yönetimi
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {/* ── ÜST KISIM: EKLEME/DÜZENLEME FORMU ── */}
                    <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                        {/* ... Başlık ve Vazgeç butonu aynı ... */}

                        {/* GRID YAPISINI DEĞİŞTİRDİK (Tek kolon oldu) */}
                        <div className="mb-3">
                            <Label className="text-[10px] text-slate-500 mb-1 block">Kategori Adı</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="h-8 text-xs bg-white flex-1"
                                    placeholder="Örn: Kardiyoloji"
                                    autoFocus // Modal açılınca direkt buraya odaklansın
                                />
                                <Button type="submit" size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : editingId ? <Save className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                    <span className="ml-1.5">{editingId ? "Kaydet" : "Ekle"}</span>
                                </Button>
                            </div>

                        </div>
                    </form>

                    {/* ── ALT KISIM: LİSTE ── */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="text-xs font-semibold text-slate-700">Mevcut Kategoriler</span>
                            <span className="text-[10px] text-slate-400">{categories.length} kayıt</span>
                        </div>

                        {loading ? (
                            <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                        ) : (
                            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1">
                                {categories.map(cat => (
                                    <div key={cat.id} className={`group flex items-center justify-between p-2 rounded border text-xs transition-colors ${editingId === cat.id ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100 hover:border-indigo-200"}`}>
                                        <div>
                                            <div className="font-medium text-slate-800">{cat.name || "İsimsiz"}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{cat.code}</div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => startEdit(cat)}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(cat.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && <div className="text-center py-4 text-xs text-slate-400">Henüz kategori eklenmemiş.</div>}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

            {/* SİLME ONAY MODALI (İç içe) */}
            <AlertDialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
                <AlertDialogContent className="bg-white border-slate-200 z-[9999]"> {/* Z-Index yüksek olsun */}
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kategoriyi Sil?</AlertDialogTitle>
                        <AlertDialogDescription>Bu işlem geri alınamaz.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-8 text-xs">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="h-8 text-xs bg-red-600 text-white hover:bg-red-700">Sil</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}