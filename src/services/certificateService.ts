import { api } from "@/lib/axios";

export interface Certificate {
    id: number;          // Id -> id
    name: string;        // Name -> name
    issuer: string;      // Issuer -> issuer
    description: string; // Description -> description
    imageUrl: string | null; // ImageUrl -> imageUrl
    isActive: boolean;   // IsActive -> isActive
}
export const certificateService = {
    getAll: async (lang: string = "en"): Promise<Certificate[]> => {
        const response = await api.get<Certificate[]>(`/Certificate?lang=${lang}`);
        return response.data;
    },

    getById: async (id: number, lang: string = "en"): Promise<Certificate> => {
        const response = await api.get<Certificate>(`/Certificate/getcertificate?id=${id}&lang=${lang}`);
        return response.data;
    },

    create: async (data: any): Promise<number> => {
        const formData = new FormData();

        // "tenr" typo'su düzeltildi, varsayılan "tr" yapıldı.
        formData.append("LanguageCode", data.languageCode || "tr");

        // Name alanı mutlaka dolu olmalı
        if (data.name) formData.append("Name", data.name);

        // Opsiyonel alanlar boşsa FormData'ya boş string ekleme, hiç ekleme!
        if (data.issuer) formData.append("Issuer", data.issuer);
        if (data.description) formData.append("Description", data.description);

        if (data.imageFile instanceof File) {
            formData.append("Image", data.imageFile);
        }

        const response = await api.post<number>("/Certificate", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    },
    update: async (id: number, data: any): Promise<void> => {
        const formData = new FormData();

        // Backend'in hangi kaydı güncelleyeceğini bilmesi için ID'yi gönderiyoruz
        formData.append("Id", id.toString());
        formData.append("LanguageCode", data.languageCode || "en");

        // Null veya boş string hatalarını engellemek için sadece dolu verileri yolluyoruz
        if (data.name) formData.append("Name", data.name);
        if (data.issuer) formData.append("Issuer", data.issuer);
        if (data.description) formData.append("Description", data.description);

        if (data.imageFile instanceof File) {
            formData.append("Image", data.imageFile);
        }

        // Axios'a multipart form datası olduğunu bildiriyoruz
        await api.put(`/Certificate/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/Certificate/${id}`);
    }
};