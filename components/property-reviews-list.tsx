import prisma from "@/lib/prisma";
import { Star } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PropertyReviewsListProps {
  propertyId: string
}

export async function PropertyReviewsList({ propertyId }: PropertyReviewsListProps) {
  const reviews = await prisma.propertyReview.findMany({
    where: { propertyId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  if (reviews.length === 0) {
    return <p className="text-muted-foreground">Nenhuma avaliação para este imóvel ainda.</p>
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <p className="font-semibold">{review.user.name || review.user.email}</p>
          <p className="text-sm text-muted-foreground">{format(review.createdAt, "dd/MM/yyyy", { locale: ptBR })}</p>
          {review.comment && <p className="mt-2 text-gray-700">{review.comment}</p>}
        </div>
      ))}
    </div>
  )
}
