import { z } from 'zod';

export const UsuarioShema = z.object({
  usuario: z.string()
    .trim()
    .min(2, "El usuario debe tener al menos 2 caracteres")
    .max(100, "El usuario no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, "Solo letras, espacios, acentos y guiones")
    .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" }),

  nombre: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, "Solo letras, espacios, acentos y guiones")
    .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" })
    .refine(val => !/^[\s'-]|[\s'-]$/.test(val), { message: "No puede empezar o terminar con espacio, guión o apóstrofe" }),

  area: z.string().min(1, "El área es requerida"),

  rol: z.string().min(1, "El rol es requerido"),

  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .refine(val => /[A-Z]/.test(val), { message: "Al menos una mayúscula" })
    .refine(val => /[a-z]/.test(val), { message: "Al menos una minúscula" })
    .refine(val => /[0-9]/.test(val), { message: "Al menos un número" })
    .refine(val => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), { message: "Al menos un carácter especial" }),

  repetirPassword: z.string()
}).refine(data => data.password === data.repetirPassword, {
  message: "Las contraseñas no coinciden",
  path: ["repetirPassword"]
});