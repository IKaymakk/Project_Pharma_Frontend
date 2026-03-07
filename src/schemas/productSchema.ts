import { z } from "zod";

export const createProductSchema = z.object({
  brandName: z.string().min(2, "Marka adı en az 2 karakter olmalıdır"),
  genericName: z.string().min(2, "Etken madde en az 2 karakter olmalıdır"),
  categoryId: z.string().min(1, "Lütfen bir kategori seçiniz"),
  dosageFormId: z.string().optional(),

  specification: z.string().max(50, "Özellik alanı çok uzun"),
  indication: z.string().optional(),
  description: z.string().optional(),

  imageUrl: z.string()
    .url("Geçerli bir bağlantı adresi giriniz (http://...)")
    .or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof createProductSchema>;