import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type ProductFormValues } from "@/schemas/productSchema";
import { productService } from "@/services/productService";
import { toast } from "react-toastify";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage // ✅ FormMessage import edilmişti, kullanıyoruz.
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Save, Globe, Image as ImageIcon, Upload } from "lucide-react";
import { lookUpService } from "@/services/lookUpService";

interface Props {
    productId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditProductDialog({ productId, open, onOpenChange, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [currentLang, setCurrentLang] = useState("tr");
    const [categories, setCategories] = useState<any[]>([]);
    const [dosageForms, setDosageForms] = useState<any[]>([]);

    // Resim State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            brandName: "", genericName: "", specification: "",
            imageUrl: "", indication: "", description: "",
            categoryId: "", dosageFormId: "",
        }
    });

    useEffect(() => {
        if (open && productId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const [productData, catData, formData] = await Promise.all([
                        productService.getById(productId, currentLang),
                        lookUpService.getCategories(currentLang),
                        lookUpService.getDosageForms(currentLang)
                    ]);

                    setCategories(catData);
                    setDosageForms(formData);

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

                    setPreviewUrl(productData.ImageUrl
                        ? `https://localhost:7249${productData.ImageUrl}`
                        : null
                    ); setSelectedFile(null);

                } catch (error) {
                    toast.error("Veriler Yüklenemedi");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, productId, currentLang, form]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (values: ProductFormValues) => {
        if (!productId) return;

        try {
            const updateData = {
                languageCode: currentLang,
                categoryId: values.categoryId,
                dosageFormId: values.dosageFormId,
                specification: values.specification,
                brandName: values.brandName,
                genericName: values.genericName,
                indication: values.indication,
                description: values.description,
                imageFile: selectedFile
            };

            await productService.update(productId, updateData);

            toast.success("Güncelleme Başarılı", { position: "top-right", autoClose: 2000 });
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Update Hatası:", error);
            toast.error("Güncelleme Başarısız");
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
                        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex justify-end">
                            <div className="flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5 text-slate-400" />
                                <Select value={currentLang} onValueChange={setCurrentLang}>
                                    <SelectTrigger className="h-7 w-32 text-xs bg-white border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tr" className="text-xs">🇹🇷 Türkçe</SelectItem>
                                        <SelectItem value="en" className="text-xs">🇺🇸 English</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">

                            {/* RESİM ALANI */}
                            <div className="flex gap-4 items-start p-3 bg-slate-50/50 rounded border border-slate-100">
                                <div
                                    className="h-20 w-20 rounded border border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition-colors shrink-0 relative group"
                                    onClick={triggerFileInput}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Önizleme" className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="h-4 w-4 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <ImageIcon className="h-6 w-6 text-slate-300" />
                                    )}
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                <div className="flex-1">
                                    <h4 className="text-xs font-semibold text-slate-700">Ürün Görseli</h4>
                                    <p className="text-[10px] text-slate-500 mb-2">Max 2MB. JPG/PNG.</p>
                                    <Button type="button" variant="outline" size="sm" onClick={triggerFileInput} className="h-6 text-[10px] bg-white">
                                        Dosya Seç
                                    </Button>
                                </div>
                            </div>

                            {/* INPUTLAR */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="brandName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Marka</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="genericName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Etken Madde</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="categoryId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Kategori</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seçiniz" /></SelectTrigger></FormControl>
                                            <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id.toString()} className="text-xs">{c.name || c.Name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dosageFormId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Form</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seçiniz" /></SelectTrigger></FormControl>
                                            <SelectContent>{dosageForms.map(f => <SelectItem key={f.id} value={f.id.toString()} className="text-xs">{f.name || f.Name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="specification" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Özellik</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="indication" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Endikasyon</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className="min-h-[40px] text-xs resize-none" placeholder="Kullanım alanı..." />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Açıklama</FormLabel>
                                    <FormControl><Textarea {...field} className="min-h-[60px] text-xs resize-none" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" /> {/* ✅ Eklendi */}
                                </FormItem>
                            )} />

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                                <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs text-slate-500">İptal</Button>
                                <Button type="submit" size="sm" className="h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                                    Güncelle
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}