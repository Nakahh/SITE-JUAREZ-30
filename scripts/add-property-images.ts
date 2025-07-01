import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const propertyImages = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop",
];

async function updatePropertyImages() {
  console.log("🖼️ Atualizando imagens dos imóveis...");

  try {
    const properties = await prisma.property.findMany();

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const imageIndex = i % propertyImages.length;

      await prisma.property.update({
        where: { id: property.id },
        data: {
          images: [propertyImages[imageIndex]],
          featured: true, // Marcar todos como destaque para aparecerem na página
        },
      });

      console.log(`✅ Imagem adicionada ao imóvel: ${property.title}`);
    }

    console.log("🎉 Todas as imagens foram atualizadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar imagens:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePropertyImages();
