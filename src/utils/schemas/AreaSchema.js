import {z} from "zod";

export const AreaSchema = z.object({
    area: z.string()
        .trim()
        .min(2, "El area debe tener al menos 2 caracteres")
        .max(255, "El area no puede exceder 255 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, "Solo letras, espacios, acentos y guiones")
        .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" })
});