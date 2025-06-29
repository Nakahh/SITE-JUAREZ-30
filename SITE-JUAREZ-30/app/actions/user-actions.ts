"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { createUserSchema, updateUserSchema } from "@/lib/schemas"

export async function createUser(formData: FormData) {
  const parsed = createUserSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      message: "Erro de validação.",
      errors: errors, // Retorna os erros detalhados para o frontend
    }
  }

  const { name, email, password, role } = parsed.data

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole, // Garante que o tipo seja UserRole
      },
    })
    revalidatePath("/admin/usuarios")
    return { success: true, message: "Usuário criado com sucesso!" }
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return { success: false, message: "Este e-mail já está em uso." }
    }
    console.error("Erro ao criar usuário:", error)
    return { success: false, message: "Erro ao criar usuário." }
  }
}
export async function updateUser(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Você precisa estar logado para editar um usuário." }
  }

  const parsed = updateUserSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      message: "Erro de validação.",
      errors: errors,
    }
  }

  const { name, email, role, password } = parsed.data

  try {
    const dataToUpdate: any = {
      name: name,
      email,
      role: role,
    }

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10) // Hash only if password is provided
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    })
    revalidatePath("/admin/usuarios")
    revalidatePath("/dashboard/perfil")
    return { success: true, message: "Usuário atualizado com sucesso!" }
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return { success: false, message: "Este e-mail já está em uso por outro usuário." }
    }
    console.error("Erro ao atualizar usuário:", error)
    return { success: false, message: "Erro ao atualizar usuário." }
  }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, message: "Você não tem permissão para excluir usuários." }
  }

  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/usuarios")
    return { success: true, message: "Usuário excluído com sucesso!" }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return { success: false, message: "Erro ao excluir usuário." }
  }
}
