import {z} from "zod";

export const RolShema = z.object({
    nombre: z.string()
        .trim()
        .min(2, "El nombre del rol debe tener al menos 2 caracteres")
        .max(100, "El nombre del rol no puede exceder 100 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'_-]+$/, "Solo letras, numeros, espacios, acentos y guiones")
        .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" })
});