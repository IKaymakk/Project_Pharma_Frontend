import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { certificateService, type Certificate } from "@/services/certificateService";
import { AddCertificateDialog } from "@/components/admin/certificates/AddCertificateDialog";
import { EditCertificateDialog } from "@/components/admin/certificates/EditCertificateDialog";

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            // ✅ SABİT "en" İLE ÇEKİYORUZ
            const data = await certificateService.getAll("en");
            setCertificates(data);
        } catch (error) {
            toast.error("Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await certificateService.delete(deleteId);
            toast.success("Certificate deleted successfully", { position: "top-right", autoClose: 2000 });
            fetchCertificates();
        } catch (error) {
            toast.error("Deletion failed");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quality & Certificates</h1>
                    <p className="text-sm text-slate-500">Manage your company documents and certificates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsAddOpen(true)} className="h-7 px-3 text-[11px] bg-slate-800 hover:bg-slate-900 text-white shadow-sm border border-slate-900">
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-24 text-center">Image</th>
                                <th className="px-6 py-4">Certificate Name</th>
                                <th className="px-6 py-4">Issuer</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto" />
                                    </td>
                                </tr>
                            ) : certificates.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="h-32 text-center text-slate-500 font-medium">
                                        No certificates found.
                                    </td>
                                </tr>
                            ) : (
                                certificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="h-12 w-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center overflow-hidden mx-auto">
                                                {cert.imageUrl ? (
                                                    <img src={`https://localhost:7249${cert.imageUrl}`} alt={cert.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Award className="h-5 w-5 text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className={`font-semibold ${cert.name === "Tanımsız" ? "text-red-400 italic" : "text-slate-800"}`}>
                                                {cert.name || "Unnamed"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-slate-600">{cert.issuer || "-"}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => setEditId(cert.id)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteId(cert.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddCertificateDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSuccess={fetchCertificates} />
            <EditCertificateDialog certificateId={editId} open={!!editId} onOpenChange={(val) => !val && setEditId(null)} onSuccess={fetchCertificates} />

            <AlertDialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
                <AlertDialogContent className="bg-white z-[9999]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to permanently delete this certificate?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}