import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "@/schemas/productSchema";
import type { ProductFormValues } from "@/schemas/productSchema";
import { productService } from "@/services/productService";
import { toast } from "react-toastify";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { lookUpService } from "@/services/lookUpService";

interface Props {
    onSuccess: () => void;
}

// 📌 BACKEND'DE BU TABLOLAR OLMADIĞI İÇİN ŞİMDİLİK ELLE YAZIYORUZ
// Buradaki ID'ler veritabanındaki (varsa) ID'lerle tutmalı. Yoksa rastgele 1,2 seçiyoruz.
const staticCategories = [
    { id: "1", name: "Onkoloji" },
    { id: "2", name: "Hematoloji" },
    { id: "3", name: "Nöroloji" },
];

const staticForms = [
    { id: "1", name: "Enjeksiyon" },
    { id: "2", name: "Tablet" },
    { id: "3", name: "Oral Çözelti" },
];

export function CreateProductDialog({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (open) {
            const fetchLookups = async () => {
                setIsLoadingLookups(true);
                try {
                    // Create işleminde varsayılan dil Türkçe ("tr")
                    const [catData, formData] = await Promise.all([
                        lookUpService.getCategories("en"),
                        lookUpService.getDosageForms("en")
                    ]);
                    setCategories(catData);
                    setDosageForms(formData);
                } catch (error) {
                    console.error(error);
                    toast.error("Liste verileri yüklenemedi!", { position: "top-right" });
                } finally {
                    setIsLoadingLookups(false);
                }
            };
            fetchLookups();
        }
    }, [open]);


    const [categories, setCategories] = useState<any[]>([]);
    const [dosageForms, setDosageForms] = useState<any[]>([]);
    const [isLoadingLookups, setIsLoadingLookups] = useState(false);
    // 1️⃣ FORM KURULUMU: React-Hook-Form'u Zod şemasıyla bağlıyoruz.
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            brandName: "",
            genericName: "",
            specification: "",
            imageUrl: "",
            indication: "",
            description: "",
            categoryId: "", // Başlangıçta boş
            dosageFormId: "",
        }
    });

    // 2️⃣ KAYDETME İŞLEMİ: Butona basılınca burası çalışır
    const onSubmit = async (values: ProductFormValues) => {
        try {
            // Backend (C#) bizden sayı (int) bekliyor ama Form (HTML) string veriyor.
            // Burada çeviri yapıyoruz:
            await productService.create({
                brandName: values.brandName,
                genericName: values.genericName,
                specification: values.specification,
                imageUrl: values.imageUrl || "", // Boş gelirse boş string yolla
                indication: values.indication || "",
                description: values.description || "",

                // String -> Number Dönüşümü
                categoryId: Number(values.categoryId),
                dosageFormId: values.dosageFormId ? Number(values.dosageFormId) : undefined,

                languageCode: "tr" // Backend'e Türkçe kaydettiğimizi söylüyoruz
            });

            // Başarılı olursa:
            toast.success("Kayıt Başarılı!", {
                position: "top-right",
                autoClose: 3000,
            }); setOpen(false);
            form.reset();
            onSuccess();

        } catch (error) {
            // Hata olursa:
            toast.error("İşlem Başarısız! Sunucu hatası oluştu.", {
                position: "top-right",
                autoClose: 4000,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* TETİKLEYİCİ BUTON (Ana Sayfadaki Buton) */}
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 px-3 text-[11px] bg-slate-800 hover:bg-slate-900 text-white shadow-sm border border-slate-900">
                    <Plus className="mr-1.5 h-3 w-3" /> Yeni Ürün
                </Button>
            </DialogTrigger>

            {/* MODAL İÇERİĞİ */}
            <DialogContent className="max-w-2xl bg-white p-0 gap-0 overflow-hidden border-slate-200">

                {/* BAŞLIK */}
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                        </div>
                        Yeni Stok Kartı Oluştur
                    </DialogTitle>
                </DialogHeader>

                {/* FORM ALANI */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">

                        {/* --- SATIR 1: Marka & Etken Madde --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="brandName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Marka Adı</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" placeholder="Örn: Keytruda" />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="genericName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Etken Madde</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" placeholder="Örn: Pembrolizumab" />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />
                        </div>

                        {/* --- SATIR 2: Kategori (Manuel Liste) & Form & Özellik --- */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* KATEGORİ (DİNAMİK) */}
                            <FormField control={form.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Kategori</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingLookups}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                <SelectValue placeholder={isLoadingLookups ? "Yükleniyor..." : "Seçiniz"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()} className="text-xs">
                                                    {c.name || c.Name} {/* Backend DTO uyumu */}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />

                            {/* FORM (DİNAMİK) */}
                            <FormField control={form.control} name="dosageFormId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Form</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingLookups}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                <SelectValue placeholder={isLoadingLookups ? "Yükleniyor..." : "Seçiniz"} />
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
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" placeholder="Örn: 100 mg" />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </div>

                        {/* --- SATIR 3: Resim URL --- */}
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">
                                    Görsel URL <span className="text-slate-300 normal-case font-normal">(İsteğe bağlı)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        // Hata varsa border kırmızı (border-red-500), yoksa gri olsun
                                        className={`h-8 text-xs bg-slate-50 ${form.formState.errors.imageUrl ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
                                        placeholder="https://example.com/resim.jpg"
                                    />
                                </FormControl>
                                {/* Hata mesajını kırmızı ve belirgin yapıyoruz */}
                                <FormMessage className="text-[10px] text-red-500 font-medium" />
                            </FormItem>
                        )} />

                        {/* --- SATIR 4: Açıklama --- */}
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Açıklama</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className="min-h-[60px] text-xs bg-slate-50 border-slate-200 resize-none" />
                                </FormControl>
                            </FormItem>
                        )} />

                        {/* ALT BUTONLAR */}
                        <DialogFooter className="pt-4 border-t border-slate-100">
                            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-8 text-xs text-slate-500">İptal</Button>
                            <Button type="submit" size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                                Kaydet
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}