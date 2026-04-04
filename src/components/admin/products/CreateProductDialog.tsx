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

export function CreateProductDialog({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [dosageForms, setDosageForms] = useState<any[]>([]);
    const [isLoadingLookups, setIsLoadingLookups] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchLookups = async () => {
                setIsLoadingLookups(true);
                try {
                    // ✅ SABİT "en"
                    const [catData, formData] = await Promise.all([
                        lookUpService.getCategories("en"),
                        lookUpService.getDosageForms("en")
                    ]);
                    setCategories(catData);
                    setDosageForms(formData);
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to load lookup data!", { position: "top-right" });
                } finally {
                    setIsLoadingLookups(false);
                }
            };
            fetchLookups();
        }
    }, [open]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            brandName: "",
            genericName: "",
            specification: "",
            imageUrl: "",
            indication: "",
            description: "",
            categoryId: "",
            dosageFormId: "",
        }
    });

    const onSubmit = async (values: ProductFormValues) => {
        try {
            await productService.create({
                brandName: values.brandName,
                genericName: values.genericName,
                specification: values.specification,
                imageUrl: values.imageUrl || "",
                indication: values.indication || "",
                description: values.description || "",
                categoryId: Number(values.categoryId),
                dosageFormId: values.dosageFormId ? Number(values.dosageFormId) : undefined,
                languageCode: "en" // ✅ SABİT "en"
            });

            toast.success("Record created successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
            setOpen(false);
            form.reset();
            onSuccess();

        } catch (error) {
            toast.error("Operation failed! Server error.", {
                position: "top-right",
                autoClose: 4000,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 px-3 text-[11px] bg-slate-800 hover:bg-slate-900 text-white shadow-sm border border-slate-900">
                    <Plus className="mr-1.5 h-3 w-3" /> Add New
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-white p-0 gap-0 overflow-hidden border-slate-200">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Plus className="h-4 w-4" />
                        </div>
                        Create New Product
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="brandName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Brand Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" placeholder="e.g: Keytruda" />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="genericName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Generic Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" placeholder="e.g: Pembrolizumab" />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingLookups}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                <SelectValue placeholder={isLoadingLookups ? "Loading..." : "Select"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()} className="text-xs">
                                                    {c.name || c.Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="dosageFormId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Form</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingLookups}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                <SelectValue placeholder={isLoadingLookups ? "Loading..." : "Select"} />
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
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="specification" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Specification</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-slate-50 border-slate-200" placeholder="e.g: 100 mg" />
                                    </FormControl>
                                    <FormMessage className="text-[10px]" />
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
                                <FormControl>
                                    <Textarea {...field} className="min-h-[60px] text-xs bg-slate-50 border-slate-200 resize-none" />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )} />

                        <DialogFooter className="pt-4 border-t border-slate-100">
                            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} className="h-8 text-xs text-slate-500">Cancel</Button>
                            <Button type="submit" size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}