import { api } from "@/lib/axios";
import type { Product, CreateProductDto } from "@/types/product";

export const productService = {
    getAll: async (lang: string = "tr"): Promise<Product[]> => {
        const response = await api.get<Product[]>(`/Products?lang=${lang}`);
        return response.data;
    },

    create: async (data: CreateProductDto): Promise<number> => {
        const response = await api.post<number>("/Products", data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/Products/${id}`);
    },
    // Tek Kayıt Getirme (YENİ EKLENEN KISIM)
    getById: async (id: number, lang: string = "tr"): Promise<Product> => {
        // Backend: [HttpGet("{id}")] public async Task<IActionResult> GetById(...)
        const response = await api.get<Product>(`/Products/${id}?lang=${lang}`);
        return response.data;
    },
    update: async (id: number, data: any): Promise<void> => {
        await api.put(`/Products/${id}`, { ...data, id });
    },
    exportToExcel: async (lang: string = "tr"): Promise<void> => {
        const response = await api.get(`/Products/export?lang=${lang}`, {
            responseType: 'blob'
        });

        // Tarayıcıda indirme tetikleme
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Urunler_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};