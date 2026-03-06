import { z } from "zod";

export const createProductSchema = z.object({
  brandName: z.string().min(2, "Marka adı en az 2 karakter olmalı"),
  genericName: z.string().min(2, "Etken madde girilmelidir"),
  categoryId: z.string().min(1, "Kategori seçilmelidir"), // Select'ten string gelir, number'a çevireceğiz
  dosageFormId: z.string().optional(),
  specification: z.string().max(50, "Çok uzun"),
  indication: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Geçerli bir URL giriniz").optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof createProductSchema>;