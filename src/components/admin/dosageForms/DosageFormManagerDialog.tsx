import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { dosageFormService, type DosageFormDto } from "@/services/dosageFormService";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Save, Trash2, Pencil, X, Tablets, Globe } from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DosageFormManagerDialog({ open, onOpenChange }: Props) {
    const [forms, setForms] = useState<DosageFormDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ✅ DİL STATE'İ EKLENDİ
    const [currentLang, setCurrentLang] = useState("tr");

    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Verileri Çek (Seçili dile göre)
    const fetchForms = async () => {
        setLoading(true);
        try {
            // ✅ "tr" YERİNE currentLang KULLANILIYOR
            const data = await dosageFormService.getAll(currentLang);
            setForms(data);
        } catch {
            toast.error("Formlar yüklenemedi", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    // Modal açıldığında VEYA dil değiştiğinde verileri yeniden çek
    useEffect(() => {
        if (open) fetchForms();
    }, [open, currentLang]); // ✅ currentLang dependency'e eklendi

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast.warning("Lütfen form adını giriniz", { position: "top-right" });
            return;
        }

        setSubmitting(true);
        try {
            if (editingId) {
                // ✅ GÜNCELLEME İŞLEMİ (Seçili dile göre)
                await dosageFormService.update(editingId, name, currentLang);
                toast.success("Çeviri/Güncelleme Başarılı", { position: "top-right", autoClose: 2000 });
            } else {
                // ✅ YENİ EKLEME (Seçili dile göre)
                await dosageFormService.create(name, currentLang);
                toast.success("Ekleme Başarılı", { position: "top-right", autoClose: 2000 });
            }

            resetForm();
            fetchForms();
        } catch (error) {
            toast.error("İşlem Başarısız", { position: "top-right" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await dosageFormService.delete(deleteId);
            toast.success("Silindi", { position: "top-right", autoClose: 2000 });
            fetchForms();
        } catch {
            toast.error("Silme Başarısız", { position: "top-right" });
        } finally {
            setDeleteId(null);
        }
    };

    const startEdit = (item: DosageFormDto) => {
        // Eğer çeviri yoksa backend 'Tanımsız' gönderiyor. Formda 'Tanımsız' yazmaması için boşaltıyoruz.
        setName(item.name === "Tanımsız" ? "" : (item.name || ""));
        setEditingId(item.id);
    };

    const resetForm = () => {
        setName("");
        setEditingId(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white p-0 gap-0 overflow-hidden border-slate-200">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Tablets className="h-4 w-4" />
                        </div>
                        Dozaj Formu Yönetimi
                    </DialogTitle>
                </DialogHeader>

                {/* ✅ DİL SEÇİCİ EKLENDİ */}
                <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex justify-end">
                    <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                        <Select value={currentLang} onValueChange={(val) => {
                            setCurrentLang(val);
                            resetForm(); // Dil değişince formu sıfırla ki yanlışlıkla eski dildeki veri kaydedilmesin
                        }}>
                            <SelectTrigger className="h-7 w-32 text-xs bg-white border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tr" className="text-xs">🇹🇷 Türkçe</SelectItem>
                                <SelectItem value="en" className="text-xs">🇺🇸 English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {editingId ? "Form Çevirisi Düzenle" : "Yeni Form Ekle"}
                            </span>
                            {editingId && (
                                <Button type="button" variant="ghost" size="sm" onClick={resetForm} className="h-5 px-2 text-[10px] text-red-500 hover:bg-red-50 hover:text-red-600">
                                    <X className="mr-1 h-3 w-3" /> Vazgeç
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label className="text-[10px] text-slate-500 mb-1 block sr-only">Form Adı</Label>
                                <Input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="h-8 text-xs bg-white"
                                    placeholder={currentLang === "tr" ? "Örn: Tablet, Şurup..." : "e.g: Tablet, Syrup..."}
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0" disabled={submitting}>
                                {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : editingId ? <Save className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                <span className="ml-1.5">{editingId ? "Kaydet" : "Ekle"}</span>
                            </Button>
                        </div>
                    </form>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="text-xs font-semibold text-slate-700">Kayıtlı Formlar</span>
                            <span className="text-[10px] text-slate-400">{forms.length} kayıt</span>
                        </div>

                        {loading ? (
                            <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                        ) : (
                            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-1">
                                {forms.map(item => (
                                    <div key={item.id} className={`group flex items-center justify-between p-2 rounded border text-xs transition-colors ${editingId === item.id ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100 hover:border-emerald-200"}`}>

                                        {/* Tanımsız ise kırmızımsı gösterelim ki çeviri eksikliği belli olsun */}
                                        <div className={`font-medium pl-1 ${item.name === "Tanımsız" ? "text-red-400 italic" : "text-slate-800"}`}>
                                            {item.name}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => startEdit(item)}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteId(item.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {forms.length === 0 && <div className="text-center py-4 text-xs text-slate-400">Kayıt bulunamadı.</div>}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

            <AlertDialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
                <AlertDialogContent className="bg-white border-slate-200 z-[9999]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Silmek İstiyor musunuz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ana kaydı silerseniz, tüm dillere ait çeviriler de devre dışı kalacaktır.
                        </AlertDialogDescription>
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