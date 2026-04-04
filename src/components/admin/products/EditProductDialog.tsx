import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type ProductFormValues } from "@/schemas/productSchema";
import { productService } from "@/services/productService";
import { toast } from "react-toastify";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Save, Image as ImageIcon, Upload } from "lucide-react";
import { lookUpService } from "@/services/lookUpService";

interface Props {
    productId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditProductDialog({ productId, open, onOpenChange, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [dosageForms, setDosageForms] = useState<any[]>([]);

    // Image State
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
                    // ✅ SABİT "en"
                    const [productData, catData, formData] = await Promise.all([
                        productService.getById(productId, "en"),
                        lookUpService.getCategories("en"),
                        lookUpService.getDosageForms("en")
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
                    toast.error("Failed to load data");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, productId, form]);

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
                languageCode: "en", // ✅ SABİT "en"
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

            toast.success("Updated Successfully", { position: "top-right", autoClose: 2000 });
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("Update Failed");
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
                        Edit Product #{productId}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                            {/* IMAGE UPLOAD */}
                            <div className="flex gap-4 items-start p-3 bg-slate-50/50 rounded border border-slate-100">
                                <div
                                    className="h-20 w-20 rounded border border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition-colors shrink-0 relative group"
                                    onClick={triggerFileInput}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
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
                                    <h4 className="text-xs font-semibold text-slate-700">Product Image</h4>
                                    <p className="text-[10px] text-slate-500 mb-2">Max 2MB. JPG/PNG.</p>
                                    <Button type="button" variant="outline" size="sm" onClick={triggerFileInput} className="h-6 text-[10px] bg-white">
                                        Choose File
                                    </Button>
                                </div>
                            </div>

                            {/* INPUTS */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="brandName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Brand Name</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px] text-red-500" />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="genericName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Generic Name</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px] text-red-500" />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="categoryId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id.toString()} className="text-xs">{c.name || c.Name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] text-red-500" />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dosageFormId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Form</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent>{dosageForms.map(f => <SelectItem key={f.id} value={f.id.toString()} className="text-xs">{f.name || f.Name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px] text-red-500" />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="specification" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Specification</FormLabel>
                                        <FormControl><Input {...field} className="h-8 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px] text-red-500" />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">
                                        Image URL <span className="text-slate-300 normal-case font-normal">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className={`h-8 text-xs bg-slate-50 ${form.formState.errors.imageUrl ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"}`}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500 font-medium" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="indication" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">
                                        Indication <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className={`min-h-[40px] text-xs bg-slate-50 ${form.formState.errors.indication ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"} resize-none`}
                                            placeholder="e.g: Pain relief, fever..."
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] text-red-500 font-medium" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Description</FormLabel>
                                    <FormControl><Textarea {...field} className="min-h-[60px] text-xs bg-slate-50 border-slate-200 resize-none" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />

                            <DialogFooter className="pt-4 border-t border-slate-100">
                                <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs text-slate-500">Cancel</Button>
                                <Button type="submit" size="sm" className="h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                                    Update
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}