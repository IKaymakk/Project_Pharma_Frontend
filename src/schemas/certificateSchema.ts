import { z } from "zod";

export const certificateSchema = z.object({
    name: z.string().min(2, "Sertifika adı en az 2 karakter olmalıdır."),
    issuer: z.string().min(2, "Veren kurum en az 2 karakter olmalıdır."),
    description: z.string().optional(),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;