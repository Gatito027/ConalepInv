import {z} from "zod";

export const LugarSchema = z.object({
    newUbicacion: z.string()
        .trim()
        .min(1, "El lugar debe tener al menos 1 caracteres")
        .max(200, "El lugar no puede exceder 200 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, "Solo letras, espacios, acentos y guiones")
        .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" })
});