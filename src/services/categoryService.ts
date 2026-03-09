import { api } from "@/lib/axios";

export interface CategoryDto {
    id: number;
    name: string;
    code: string;
    languageCode: string;
}

export const categoryService = {
    getAll: async (lang: string = "tr"): Promise<CategoryDto[]> => {
        const response = await api.get<CategoryDto[]>(`/Categories?lang=${lang}`); // Controller ismini kontrol et (Categories veya Lookups)
        return response.data;
    },

    create: async (name: string, code: string, lang: string = "tr"): Promise<number> => {
        const response = await api.post("/Categories", { name, code: null, languageCode: lang });
        return response.data;
    },

    update: async (id: number, name: string, code: string, lang: string = "tr"): Promise<void> => {
        await api.put(`/Categories/${id}`, { id, name, code: null, languageCode: lang });
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/Categories/${id}`);
    }
};