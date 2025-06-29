import { z } from "zod"
import { UserRole } from "@prisma/client"

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Papel inválido." }),
  }),
})

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório.").optional(), // Optional for update
  email: z.string().email("E-mail inválido.").optional(), // Optional for update
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres.").optional().or(z.literal("")), // Optional, can be empty string
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Papel inválido." }),
  }).optional(), // Optional for update
})