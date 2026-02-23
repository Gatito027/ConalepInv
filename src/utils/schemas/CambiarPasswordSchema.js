import { z } from "zod";

export const CambiarPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .refine((val) => /[A-Z]/.test(val), { message: "Al menos una mayúscula" })
      .refine((val) => /[a-z]/.test(val), { message: "Al menos una minúscula" })
      .refine((val) => /[0-9]/.test(val), { message: "Al menos un número" })
      .refine(
        (val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val),
        { message: "Al menos un carácter especial" }
      ),
    repetirPassword: z.string(),
  })
  .refine((data) => data.password === data.repetirPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repetirPassword"],
  });