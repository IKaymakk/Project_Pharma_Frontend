import { api } from "@/lib/axios";
import type { Category } from "@/types/category";
import type { DosageForms } from "@/types/dosageForms";


export const lookUpService = {
    getCategories: async (lang: string = "en"): Promise<Category[]> => {
        const response = await api.get<Category[]>(`/Categories?lang=${lang}`);
        return response.data;
    },

    getDosageForms: async (lang: string = "tr"): Promise<DosageForms[]> => {
        const response = await api.get<DosageForms[]>(`/DosageForms?lang=${lang}`);
        return response.data;
    }

}

