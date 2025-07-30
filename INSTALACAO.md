# 📋 Guia de Instalação - BeatConnect

Este guia irá te ajudar a configurar o BeatConnect com Supabase passo a passo.

## 🎯 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Editor de código (VS Code, Sublime, etc.)
- Navegador web moderno

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Sign In" e faça login
3. Clique em "New Project"
4. Preencha:
   - **Name**: `beatconnect`
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a mais próxima (ex: São Paulo)
5. Clique em "Create new project"
6. Aguarde a criação (pode demorar alguns minutos)

### 2. Configurar Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole e execute este código:

```sql
-- Criar tabela de beats
CREATE TABLE beats (
    id SERIAL PRIMARY KEY,
    producer_name VARCHAR(255) NOT NULL,
    beat_title VARCHAR(255) NOT NULL,
    message TEXT,
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de autenticação admin
CREATE TABLE admin_auth (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir admin padrão
INSERT INTO admin_auth (username, password_hash) 
VALUES ('admin', 'admin123');

-- Habilitar RLS (Row Level Security)
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para beats
CREATE POLICY "Allow beat insertion" ON beats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read" ON beats
    FOR SELECT USING (true);

CREATE POLICY "Allow admin update" ON beats
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete" ON beats
    FOR DELETE USING (true);
```

### 3. Configurar Storage

1. No painel do Supabase, vá para **Storage**
2. Clique em **New Bucket**
3. Configure:
   - **Name**: `beats`
   - **Public bucket**: ✅ Marque esta opção
4. Clique em **Create bucket**
5. Vá para **SQL Editor** novamente e execute:

```sql
-- Políticas para storage
CREATE POLICY "Allow file uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'beats');

CREATE POLICY "Allow file downloads" ON storage.objects
    FOR SELECT USING (bucket_id = 'beats');
```

### 4. Obter Credenciais

1. No painel do Supabase, vá para **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public** (chave anônima)

### 5. Configurar Arquivos

1. Abra o arquivo `supabase-config.js`
2. Substitua as credenciais:

```javascript
const SUPABASE_URL = 'SUA_URL_AQUI'
const SUPABASE_ANON_KEY = 'SUA_CHAVE_AQUI'
```

### 6. Testar o Sistema

1. Abra `home.html` no navegador
2. Teste a navegação entre as páginas
3. Vá para `index.html` e teste o envio de um beat
4. Vá para `dashboard.html` e faça login:
   - **Usuário**: `admin`
   - **Senha**: `admin123`

## 🔧 Configurações Adicionais

### Personalizar Cores

Edite as variáveis CSS em qualquer arquivo HTML:

```css
:root {
    --primary: #6366f1;        /* Cor principal */
    --primary-dark: #4f46e5;   /* Cor escura */
    --bg: #0f0f23;             /* Fundo */
    --bg-light: #1a1a2e;       /* Fundo claro */
    --bg-card: #16213e;        /* Cards */
    --text: #e2e8f0;           /* Texto */
    --text-muted: #94a3b8;     /* Texto secundário */
}
```

### Alterar Senha do Admin

1. No Supabase, vá para **SQL Editor**
2. Execute:

```sql
UPDATE admin_auth 
SET password_hash = 'nova_senha_aqui' 
WHERE username = 'admin';
```

### Configurar Domínio Personalizado

1. No Supabase, vá para **Settings** → **General**
2. Em **Custom domains**, adicione seu domínio
3. Configure DNS conforme instruções

## 🚀 Deploy

### Opção 1: Vercel (Recomendado)

1. Crie conta no [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy automático

### Opção 2: Netlify

1. Crie conta no [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto
3. Configure as variáveis de ambiente
4. Deploy instantâneo

### Opção 3: GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Vá em **Settings** → **Pages**
4. Configure o branch e pasta

## 🔍 Solução de Problemas

### Erro de CORS
- Verifique se as credenciais do Supabase estão corretas
- Confirme se o domínio está na lista de permissões

### Upload não funciona
- Verifique se o bucket `beats` foi criado
- Confirme as políticas de storage

### Login não funciona
- Verifique se a tabela `admin_auth` foi criada
- Confirme se o usuário `admin` foi inserido

### Arquivos não aparecem
- Verifique as políticas RLS
- Confirme se o bucket está público

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Confirme se todas as etapas foram seguidas
3. Verifique as credenciais do Supabase
4. Teste com dados de exemplo

## ✅ Checklist de Instalação

- [ ] Projeto Supabase criado
- [ ] Tabelas criadas no banco
- [ ] Storage configurado
- [ ] Políticas RLS aplicadas
- [ ] Credenciais configuradas
- [ ] Teste de envio funcionando
- [ ] Dashboard admin funcionando
- [ ] Deploy realizado

---

**🎉 Parabéns! Seu BeatConnect está funcionando!** 