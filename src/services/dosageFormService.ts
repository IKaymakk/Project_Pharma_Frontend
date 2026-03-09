import { api } from "@/lib/axios";

export interface DosageFormDto {
    id: number;
    name: string;
}

export const dosageFormService = {
    getAll: async (lang: string = "tr"): Promise<DosageFormDto[]> => {
        const response = await api.get<DosageFormDto[]>(`/DosageForms?lang=${lang}`);
        return response.data;
    },

    create: async (name: string, lang: string = "tr"): Promise<number> => {
        const response = await api.post("/DosageForms", { name, languageCode: lang });
        return response.data;
    },

    update: async (id: number, name: string, lang: string = "tr"): Promise<void> => {
        await api.put(`/DosageForms/${id}`, { id, name, languageCode: lang });
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/DosageForms/${id}`);
    }
};