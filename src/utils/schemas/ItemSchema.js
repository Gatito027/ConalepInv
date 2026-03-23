import { z } from "zod";

export const ItemSchema = z.object({
  descripcion: z
    .string()
    .trim()
    .min(2, "La descripción debe tener al menos 2 caracteres")
    .max(200, "La descripción no puede exceder 200 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'_-]+$/,
      "Solo letras, números, espacios, acentos, guiones y guion bajo"
    )
    .refine((val) => !/\s{2,}/.test(val), {
      message: "No puede tener espacios consecutivos",
    }),

  subcuenta: z.string()
    .regex(/^\d+$/, "Solo debe contener solo números positivos"),

  estado: z.enum(["Bueno", "Malo", "Obsoleto", "Regular"], "Estado inválido"),

  numeroInv: z.string()
    .regex(/^\d+$/, "Solo debe contener solo números positivos"),

  codigoPartida: z
    .string()
    .regex(/^\d+-\d+$/, "Formato inválido, debe ser números-números (ej. 54332-3253)"),

  observaciones: z
    .string()
    .max(200, "No puede exceder 200 caracteres")
    .refine((val) => !/\s{2,}/.test(val), {
      message: "No puede tener espacios consecutivos",
    })
    .optional(),

  cantidad: z.string()
    .regex(/^\d+$/, "Solo debe contener solo números positivos"),

  serie: z
    .string()
    .trim()
    .max(50, "No debe exceder 50 caracteres")
    .regex(/^$|^[A-Za-z0-9-_]+$/, "Formato inválido")
    .optional(),

  valorLibros: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido, máximo dos decimales")
    .transform((val) => val === "" ? undefined : parseFloat(val))
    .refine((val) => val === undefined || val > 0, {
        message: "Debe ser mayor que 0",
    })
    .optional(),

  despreciacion: z
    .string()
    .regex(/^$|\d+(\.\d{1,2})?$/, "Formato inválido, máximo dos decimales")
    .transform((val) => val === "" ? undefined : parseFloat(val))
    .refine((val) => val === undefined || val > 0, {
        message: "Debe ser mayor que 0",
    })
    .optional(),

  costoAdquidsion: z
    .string()
    .regex(/^$|\d+(\.\d{1,2})?$/, "Formato inválido, máximo dos decimales")
    .transform((val) => val === "" ? undefined : parseFloat(val))
    .refine((val) => val === undefined || val > 0, {
        message: "Debe ser mayor que 0",
    })
    .optional(),

  fechaAdquision: z.string().optional(),

  tipobaja: z.string()
    .trim()
    .max(250, "La el motivo no puede exceder 250 caracteres")
    .regex(
      /^$|[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'_-]+$/,
      "Solo letras, números, espacios, acentos, guiones y guion bajo"
    )
    .refine((val) => !/\s{2,}/.test(val), {
      message: "No puede tener espacios consecutivos",
    })
    .optional(),

  fechaBaja: z.string().optional(),

  fechaResguardo: z.string().optional(),

  motivoResguardo: z.string()
    .trim()
    .max(250, "La el motivo no puede exceder 250 caracteres")
    .regex(
      /^$|[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'_-]+$/,
      "Solo letras, números, espacios, acentos, guiones y guion bajo"
    )
    .refine((val) => !/\s{2,}/.test(val), {
      message: "No puede tener espacios consecutivos",
    })
    .optional(),

  cuenta: z
    .string()
    .regex(/^$|\d+$/, "Solo debe contener solo números positivos")
    .optional(),

  valor: z
    .string()
    .regex(/^$|\d+(\.\d{1,2})?$/, "Formato inválido, máximo dos decimales")
    .transform((val) => val === "" ? undefined : parseFloat(val))
    .refine((val) => val === undefined || val > 0, {
        message: "Debe ser mayor que 0",
    })
    .optional(),

  vidaUtil: z.string()
    .regex(/^\d+$/, { message: "Solo debe contener números positivos" })
    .transform(val => Number(val)),

  polizaFecha: z.string().optional(),

  polizaDate: z.string().optional(),
});