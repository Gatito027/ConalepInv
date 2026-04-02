import {z} from 'zod';

export const ExportSchema = z.object({
    startedInv: z.string()
        .regex(/^\d+$/, "Solo debe contener solo números positivos")
        .optional(),
    endInv: z.string()
        .regex(/^\d+$/, "Solo debe contener solo números positivos")
        .optional(),
    descripcion: z.string()
        .trim()
        .min(2, "La descripción debe tener al menos 2 caracteres")
        .max(200, "La descripción no puede exceder 200 caracteres")
        .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'_-]+$/,
        "Solo letras, números, espacios, acentos, guiones y guion bajo"
        )
        .refine((val) => !/\s{2,}/.test(val), {
        message: "No puede tener espacios consecutivos",
        })
        .optional(),
});