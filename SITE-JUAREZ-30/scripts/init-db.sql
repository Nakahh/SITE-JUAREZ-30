-- Este script cria as tabelas no banco de dados.
-- Execute este script usando a ferramenta de linha de comando do seu banco de dados (ex: psql para PostgreSQL).

-- Certifique-se de que a extensão 'uuid-ossp' esteja disponível se você estiver usando PostgreSQL
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE papel AS ENUM ('ADMIN', 'CORRETOR', 'ASSISTENTE', 'CLIENTE');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Usando gen_random_uuid() para PostgreSQL 13+
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    nome VARCHAR(255) NOT NULL,
    papel papel DEFAULT 'CLIENTE',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    quartos INTEGER NOT NULL,
    area DECIMAL NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'Disponível',
    imageUrls TEXT[], -- Novo campo para array de URLs de imagens
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    conteudo TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conteudo TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    propertyId UUID NOT NULL,
    clientName VARCHAR(255) NOT NULL,
    clientEmail VARCHAR(255) NOT NULL,
    clientPhone VARCHAR(20),
    dataHora TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(255) DEFAULT 'Pendente',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    valor DECIMAL NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorite_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    propertyId UUID NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (userId, propertyId), -- Garante que um usuário não favorite o mesmo imóvel duas vezes
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
