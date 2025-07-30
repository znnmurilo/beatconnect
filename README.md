# 🎵 BeatConnect

Plataforma profissional para conectar produtores ao **Emite Unico**. Envie seus beats diretamente e acompanhe o status em tempo real.

## ✨ Características

- 🎯 **Foco único**: Apenas o Emite Unico como artista destinatário
- 🚀 **Envio direto**: Sem cadastro, apenas envie seu beat
- 📊 **Dashboard admin**: Sistema de login para gerenciar beats
- 🎨 **Design moderno**: Interface cinza/preto com efeitos visuais
- 📱 **Responsivo**: Funciona perfeitamente em todos os dispositivos
- ⚡ **Performance**: Animações suaves e carregamento rápido

## 🏗️ Estrutura do Projeto

```
beatconnect/
├── home.html          # Página inicial com apresentação
├── index.html         # Página de envio de beats
├── dashboard.html     # Dashboard administrativo
├── supabase-config.js # Configuração do banco de dados
└── README.md          # Este arquivo
```

## 🚀 Como Usar

### Para Produtores
1. Acesse `index.html`
2. Preencha o formulário com seus dados
3. Selecione o arquivo do beat (.mp3 ou .wav)
4. Envie e aguarde o feedback

### Para Administradores
1. Acesse `dashboard.html`
2. Faça login com as credenciais:
   - **Usuário**: `admin`
   - **Senha**: `admin123`
3. Gerencie os beats recebidos

## 🗄️ Configuração do Supabase

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e a chave anônima

### 2. Configurar Banco de Dados

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Tabela para armazenar os beats
CREATE TABLE beats (
    id SERIAL PRIMARY KEY,
    producer_name VARCHAR(255) NOT NULL,
    beat_title VARCHAR(255) NOT NULL,
    message TEXT,
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela para autenticação de admin
CREATE TABLE admin_auth (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir admin padrão (senha: admin123)
INSERT INTO admin_auth (username, password_hash) 
VALUES ('admin', '$2a$10$your_hashed_password_here');

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

-- Permitir inserção de beats (qualquer pessoa pode enviar)
CREATE POLICY "Allow beat insertion" ON beats
    FOR INSERT WITH CHECK (true);

-- Permitir leitura de beats apenas para admins autenticados
CREATE POLICY "Allow admin read" ON beats
    FOR SELECT USING (auth.role() = 'authenticated');

-- Permitir atualização de beats apenas para admins
CREATE POLICY "Allow admin update" ON beats
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Permitir exclusão de beats apenas para admins
CREATE POLICY "Allow admin delete" ON beats
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 3. Configurar Storage
1. No painel do Supabase, vá para "Storage"
2. Crie um novo bucket chamado `beats`
3. Configure as políticas de acesso:

```sql
-- Permitir upload de arquivos
CREATE POLICY "Allow file uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'beats');

-- Permitir download de arquivos para admins
CREATE POLICY "Allow admin downloads" ON storage.objects
    FOR SELECT USING (bucket_id = 'beats' AND auth.role() = 'authenticated');
```

### 4. Atualizar Configuração
Edite o arquivo `supabase-config.js`:

```javascript
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE'
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_DO_SUPABASE'
```

## 🎨 Personalização

### Cores
As cores principais estão definidas nas variáveis CSS:

```css
:root {
    --primary: #6366f1;        /* Cor principal */
    --primary-dark: #4f46e5;   /* Cor principal escura */
    --bg: #0f0f23;             /* Fundo principal */
    --bg-light: #1a1a2e;       /* Fundo claro */
    --bg-card: #16213e;        /* Fundo dos cards */
    --text: #e2e8f0;           /* Texto principal */
    --text-muted: #94a3b8;     /* Texto secundário */
}
```

### Efeitos Visuais
- Animações de entrada suaves
- Efeitos hover nos botões e cards
- Background animado com pontos
- Gradientes e sombras

## 🔧 Funcionalidades Técnicas

### Frontend
- HTML5 semântico
- CSS3 com variáveis customizadas
- JavaScript vanilla (sem frameworks)
- Animações CSS e JavaScript
- Drag & drop para upload de arquivos

### Backend (Supabase)
- PostgreSQL como banco de dados
- Row Level Security (RLS)
- Storage para arquivos
- Autenticação de administradores
- APIs REST automáticas

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

## 🔒 Segurança

- Autenticação de administradores
- Validação de arquivos (apenas .mp3 e .wav)
- Políticas de segurança no banco de dados
- Sanitização de dados de entrada

## 🚀 Deploy

### Opções de Hospedagem
1. **Vercel** (Recomendado)
2. **Netlify**
3. **GitHub Pages**
4. **Firebase Hosting**

### Passos para Deploy
1. Faça upload dos arquivos HTML
2. Configure as variáveis do Supabase
3. Teste todas as funcionalidades
4. Configure domínio personalizado (opcional)

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas:
- 📧 Email: suporte@beatconnect.com
- 💬 Discord: [Link do servidor]
- 📱 WhatsApp: [Número de contato]

---

**Desenvolvido com ❤️ para conectar produtores ao Emite Unico** 