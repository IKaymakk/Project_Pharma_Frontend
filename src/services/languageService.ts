import { api } from "@/lib/axios";

export interface Language {
    code: string;
    name: string;
}

export const languageService = {
    getAll: async (): Promise<Language[]> => {
        const response = await api.get<Language[]>("/Language");
        return response.data;
    }
};