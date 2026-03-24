import { z } from "zod";

const StringSchema = (nombreCampo: string) =>
  z.string()
    .trim()
    .min(2, `Debe tener al menos 2 caracteres`)
    .max(255, `No puede exceder 255 caracteres`)
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'-]+$/,
      `Solo puede contener letras, números, espacios, acentos y guiones`
    )
    .refine(val => !/\s{2,}/.test(val), {
      message: `No puede tener espacios consecutivos`,
    });

export const crearSchemaCampo = (campo: string) =>
  z.object({
    [campo]: StringSchema(campo),
  });