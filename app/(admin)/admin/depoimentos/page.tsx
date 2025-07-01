"use client";

import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
  deleteTestimonial,
  approveTestimonial,
} from "@/app/actions/testimonial-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const prisma = new PrismaClient();

function DeleteTestimonialDialog({
  testimonialId,
  authorName,
}: {
  testimonialId: string;
  authorName: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            depoimento de <span className="font-bold">{authorName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteTestimonial(testimonialId);
              window.location.reload();
            }}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default async function AdminTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Depoimentos</h1>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nenhum depoimento cadastrado ainda.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Conteúdo</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Aprovado</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">
                  {testimonial.authorName}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {testimonial.content}
                </TableCell>
                <TableCell>{testimonial.rating} Estrelas</TableCell>
                <TableCell>
                  {testimonial.approved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  {format(testimonial.createdAt, "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {!testimonial.approved && (
                      <form
                        action={approveTestimonial.bind(null, testimonial.id)}
                      >
                        <Button variant="outline" size="icon" title="Aprovar">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="sr-only">Aprovar</span>
                        </Button>
                      </form>
                    )}
                    <Link
                      href={`/admin/admin/depoimentos/edit/${testimonial.id}`}
                    >
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </Link>
                    <DeleteTestimonialDialog
                      testimonialId={testimonial.id}
                      authorName={testimonial.authorName}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
