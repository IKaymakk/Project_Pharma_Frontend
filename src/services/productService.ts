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
};