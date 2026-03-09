import { api } from "@/lib/axios";
import type { Product, CreateProductDto } from "@/types/product";

export const productService = {
    getAll: async (lang: string = "tr"): Promise<Product[]> => {
        const response = await api.get<Product[]>(`/Products?lang=${lang}`);
        return response.data;
    },

    create: async (data: CreateProductDto): Promise<number> => {
        // Create işlemi için de FormData kullanmak gerekebilir ama şimdilik Update odaklıyız.
        const response = await api.post<number>("/Products", data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/Products/${id}`);
    },

    getById: async (id: number, lang: string = "tr"): Promise<Product> => {
        const response = await api.get<Product>(`/Products/${id}?lang=${lang}`);
        return response.data;
    },

    // 🔥 DÜZELTİLEN KISIM 🔥
    update: async (id: number, data: any): Promise<void> => {
        const formData = new FormData();

        // Backend Property İsimleri (Büyük Harf / PascalCase)
        formData.append("Id", id.toString());
        formData.append("LanguageCode", data.languageCode || "tr");

        if (data.categoryId) formData.append("CategoryId", data.categoryId.toString());
        if (data.dosageFormId) formData.append("DosageFormId", data.dosageFormId.toString());

        formData.append("BrandName", data.brandName || "");
        formData.append("GenericName", data.genericName || "");
        formData.append("Specification", data.specification || "");
        formData.append("Indication", data.indication || "");
        formData.append("Description", data.description || "");

        // Resim Dosyası: Backend 'Image' bekliyor
        if (data.imageFile instanceof File) {
            formData.append("Image", data.imageFile);
        }

        await api.put(`/Products/${id}`, formData, {
            headers: { "Content-Type": undefined }
        });
    },

    exportToExcel: async (lang: string = "tr"): Promise<void> => {
        const response = await api.get(`/Products/export?lang=${lang}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Urunler_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};