import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateSchema, type CertificateFormValues } from "@/schemas/certificateSchema";
import { certificateService } from "@/services/certificateService";
import { toast } from "react-toastify";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Save, Upload, Award } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddCertificateDialog({ open, onOpenChange, onSuccess }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CertificateFormValues>({
        resolver: zodResolver(certificateSchema),
        defaultValues: { name: "", issuer: "", description: "" }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (values: CertificateFormValues) => {
        if (!selectedFile) {
            toast.warning("Please select a certificate image.");
            return;
        }

        try {
            // ✅ SABİT "en" İLE GÖNDERİYORUZ
            await certificateService.create({
                languageCode: "en",
                name: values.name,
                issuer: values.issuer,
                description: values.description,
                imageFile: selectedFile
            });

            toast.success("Certificate added successfully", { position: "top-right", autoClose: 2000 });
            form.reset();
            setPreviewUrl(null);
            setSelectedFile(null);
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            toast.error("Failed to add certificate");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl bg-white p-0 gap-0 overflow-hidden border-slate-200">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <DialogTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Plus className="h-3.5 w-3.5" />
                        </div>
                        Add New Certificate
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div className="flex gap-4 items-start p-3 bg-slate-50/50 rounded border border-slate-100">
                            <div
                                className="h-24 w-20 rounded border border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors shrink-0 relative group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="h-4 w-4 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <Award className="h-6 w-6 text-slate-300" />
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                            <div className="flex-1 pt-1">
                                <h4 className="text-xs font-semibold text-slate-700">Certificate Image</h4>
                                <p className="text-[10px] text-slate-500 mb-2">Max 2MB. JPG, PNG or PDF format.</p>
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-6 text-[10px] bg-white">
                                    Choose File
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Certificate Name</FormLabel>
                                    <FormControl><Input {...field} className="h-8 text-xs" placeholder="e.g: GDP Certificate" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="issuer" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Issuer</FormLabel>
                                    <FormControl><Input {...field} className="h-8 text-xs" placeholder="e.g: Ministry of Health" /></FormControl>
                                    <FormMessage className="text-[10px] text-red-500" />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[11px] font-semibold text-slate-500 uppercase">Description (Optional)</FormLabel>
                                <FormControl><Textarea {...field} className="min-h-[60px] text-xs resize-none" /></FormControl>
                                <FormMessage className="text-[10px] text-red-500" />
                            </FormItem>
                        )} />

                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs text-slate-500">Cancel</Button>
                            <Button type="submit" size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}