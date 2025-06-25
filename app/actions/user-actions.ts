"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  if (!name || !email || !password || !role) {
    return { success: false, message: "Todos os campos são obrigatórios." }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        papel: role,
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

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as string
  const password = formData.get("password") as string // Pode ser vazio

  if (!name || !email || !role) {
    return { success: false, message: "Nome, e-mail e papel são obrigatórios." }
  }

  try {
    const dataToUpdate: any = {
      name,
      email,
      papel: role,
    }

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    })
    revalidatePath("/admin/usuarios")
    revalidatePath("/dashboard/perfil") // Revalidar perfil do usuário se for o próprio
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
  if (!session?.user?.id || session.user.papel !== "ADMIN") {
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
