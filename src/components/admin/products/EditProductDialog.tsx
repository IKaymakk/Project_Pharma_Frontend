import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type ProductFormValues } from "@/schemas/productSchema";
import { productService } from "@/services/productService";
import { toast } from "react-toastify"; import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Save, Globe } from "lucide-react";
import { lookUpService } from "@/services/lookUpService";


interface Props {
    productId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditProductDialog({ productId, open, onOpenChange, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);

    // --- DÜZELTME: State'leri Fonksiyonun İÇİNE aldık ---
    const [currentLang, setCurrentLang] = useState("tr"); // Varsayılan TR olsun
    const [categories, setCategories] = useState<any[]>([]);
    const [dosageForms, setDosageForms] = useState<any[]>([]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            brandName: "", genericName: "", specification: "",
            imageUrl: "", indication: "", description: "",
            categoryId: "", dosageFormId: "",
        }
    });

    // MODAL AÇILINCA VEYA DİL DEĞİŞİNCE ÇALIŞIR
    useEffect(() => {
        if (open && productId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    // API İstekleri
                    const [productData, catData, formData] = await Promise.all([
                        productService.getById(productId, currentLang),
                        lookUpService.getCategories(currentLang),
                        lookUpService.getDosageForms(currentLang)
                    ]);

                    setCategories(catData);
                    setDosageForms(formData);

                    // Formu Doldurma
                    form.reset({
                        brandName: productData.BrandName,
                        genericName: productData.GenericName,
                        specification: productData.Specification,
                        imageUrl: productData.ImageUrl || "",
                        indication: productData.Indication || "",
                        description: productData.Description || "",
                        categoryId: productData.CategoryId?.toString(),
                        dosageFormId: productData.DosageFormId?.toString(),
                    });

                } catch (error) {
                    toast.error("Veriler Yüklenemedi", { position: "top-right" })
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, productId, currentLang, form, toast]); // Dependency array eksiksiz

    const onSubmit = async (values: ProductFormValues) => {
        if (!productId) return; // Güvenlik önlemi

        try {
            // Butonu 'Loading' moduna alabilirsin (form.formState.isSubmitting ile)

            // Backend'in beklediği DTO formatına çevir
            const updateDto = {
                id: productId, // DTO için ID şart
                languageCode: currentLang, // Şu an seçili olan dil (tr/en/de)

                // Ana Tablo (Global)
                categoryId: Number(values.categoryId),
                dosageFormId: values.dosageFormId ? Number(values.dosageFormId) : null,
                specification: values.specification,
                imageUrl: values.imageUrl || "",

                // Çeviri Tablosu (Local)
                brandName: values.brandName,
                genericName: values.genericName,
                indication: values.indication || "",
                description: values.description || ""
            };

            // Servise gönder
            await productService.update(productId, updateDto);

            toast.success("Ürün Başarıyla Güncellendi", {
                position: "top-right",
                autoClose: 4000,
            });
            onOpenChange(false); // Modalı kapat
            onSuccess(); // Ana sayfadaki listeyi yenile (Refresh)

        } catch (error) {
            console.error(error);
            toast.error("Güncelleme Başarısız", {
                position: "top-right",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-white p-0 gap-0 overflow-hidden border-slate-200">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center">
                            <Pencil className="h-3.5 w-3.5" />
                        </div>
                        Ürün Düzenle #{productId}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                ) : (
                    <Form {...form}>
                        {/* DİL SEÇİM ALANI */}
                        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex justify-end">
                            <div className="flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5 text-slate-400" />
                                <Select value={currentLang} onValueChange={setCurrentLang}>
                                    <SelectTrigger className="h-7 w-32 text-xs bg-white border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tr" className="text-xs">🇹🇷 Türkçe</SelectItem>
                                        <SelectItem value="en" className="text-xs">🇺🇸 English</SelectItem>
                                        <SelectItem value="ru" className="text-xs">ru CYKA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="brandName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Marka Adı</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="genericName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Etken Madde</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" /></FormControl>
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {/* KATEGORİ SELECT */}
                                <FormField control={form.control} name="categoryId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Kategori</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map(c => (
                                                    // DİKKAT: Backend DTO'da Property ismi neyse (Name/categoryName) onu kullan
                                                    <SelectItem key={c.id} value={c.id.toString()} className="text-xs">
                                                        {c.name || c.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />

                                {/* DOSAGE FORM SELECT */}
                                <FormField control={form.control} name="dosageFormId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Form</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {dosageForms.map(f => (
                                                    <SelectItem key={f.id} value={f.id.toString()} className="text-xs">
                                                        {f.name || f.Name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="specification" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Özellik</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" /></FormControl>
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Görsel URL</FormLabel>
                                    <FormControl><Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" /></FormControl>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Açıklama</FormLabel>
                                    <FormControl><Textarea {...field} className="min-h-[60px] text-xs bg-slate-50 border-slate-200 resize-none" /></FormControl>
                                </FormItem>
                            )} />

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                                <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs text-slate-500">İptal</Button>
                                <Button type="submit" size="sm" className="h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white">
                                    <Save className="mr-2 h-3 w-3" /> Güncelle
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}