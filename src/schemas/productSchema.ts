import { z } from "zod";

export const createProductSchema = z.object({
  brandName: z.string().min(2, "Marka adı en az 2 karakter olmalıdır"),
  genericName: z.string().min(2, "Etken madde en az 2 karakter olmalıdır"),
  categoryId: z.string().min(1, "Lütfen bir kategori seçiniz"),
  dosageFormId: z.string().optional(),

  specification: z.string()
    .min(1, "Özellik alanı zorunludur")
    .max(50, "Özellik alanı çok uzun (Max 50 karakter)"),

  indication: z.string().min(1, "Endikasyon alanı zorunludur"),

  description: z.string().min(1, "Açıklama alanı zorunludur"),

  imageUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof createProductSchema>;