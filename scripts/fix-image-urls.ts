import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixImageUrls() {
  console.log("🔧 Fixing malformed image URLs...");

  try {
    // Get all properties with potentially malformed images
    const properties = await prisma.property.findMany();

    let fixedCount = 0;

    for (const property of properties) {
      let needsUpdate = false;
      let fixedImages = property.images;

      // Check if images is malformed
      if (property.images) {
        // If it's a string that looks malformed
        if (typeof property.images === "string") {
          try {
            const parsed = JSON.parse(property.images);
            if (Array.isArray(parsed)) {
              // Check each image URL in the array
              const cleanImages = parsed.filter((img: any) => {
                return (
                  typeof img === "string" &&
                  img.length > 1 &&
                  !img.startsWith("[") &&
                  (img.startsWith("/") || img.startsWith("http"))
                );
              });

              if (cleanImages.length === 0) {
                fixedImages = ["/placeholder-property.svg"];
                needsUpdate = true;
              } else if (cleanImages.length !== parsed.length) {
                fixedImages = cleanImages;
                needsUpdate = true;
              }
            } else {
              fixedImages = ["/placeholder-property.svg"];
              needsUpdate = true;
            }
          } catch (error) {
            // If parsing fails, set default
            fixedImages = ["/placeholder-property.svg"];
            needsUpdate = true;
          }
        }
        // If it's already an array, validate each URL
        else if (Array.isArray(property.images)) {
          const cleanImages = property.images.filter((img: any) => {
            return (
              typeof img === "string" &&
              img.length > 1 &&
              !img.startsWith("[") &&
              (img.startsWith("/") || img.startsWith("http"))
            );
          });

          if (cleanImages.length === 0) {
            fixedImages = ["/placeholder-property.svg"];
            needsUpdate = true;
          } else if (cleanImages.length !== property.images.length) {
            fixedImages = cleanImages;
            needsUpdate = true;
          }
        }
      } else {
        // If images is null/undefined, set default
        fixedImages = ["/placeholder-property.svg"];
        needsUpdate = true;
      }

      if (needsUpdate) {
        await prisma.property.update({
          where: { id: property.id },
          data: { images: fixedImages },
        });

        console.log(`✅ Fixed images for property: ${property.title}`);
        fixedCount++;
      }
    }

    console.log(`🎉 Fixed ${fixedCount} properties with malformed image URLs`);
  } catch (error) {
    console.error("❌ Error fixing image URLs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
