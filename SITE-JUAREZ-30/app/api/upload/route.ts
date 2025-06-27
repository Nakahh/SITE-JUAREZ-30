import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 })
  }

  if (!request.body) {
    return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
  }

  const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
  const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY
  const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY
  const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME

  if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY || !MINIO_BUCKET_NAME) {
    return NextResponse.json({ error: "MinIO environment variables are not configured" }, { status: 500 })
  }

  const s3Client = new S3Client({
    endpoint: MINIO_ENDPOINT,
    region: "us-east-1", // Região pode ser qualquer uma para MinIO, mas é obrigatória
    credentials: {
      accessKeyId: MINIO_ACCESS_KEY,
      secretAccessKey: MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // Importante para MinIO
  })

  try {
    const buffer = Buffer.from(await request.arrayBuffer())
    const fileExtension = filename.split(".").pop()
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
    const key = `images/${uniqueFilename}` // Pasta 'images' dentro do bucket

    const uploadCommand = new PutObjectCommand({
      Bucket: MINIO_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: request.headers.get("content-type") || "application/octet-stream",
      ACL: "public-read", // Permite acesso público à imagem
    })

    await s3Client.send(uploadCommand)

    // A URL pública da imagem no MinIO será construída a partir do endpoint e da chave
    const imageUrl = `${MINIO_ENDPOINT}/${MINIO_BUCKET_NAME}/${key}`

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("Error uploading to MinIO:", error)
    return NextResponse.json({ error: "Failed to upload image to MinIO" }, { status: 500 })
  }
}
