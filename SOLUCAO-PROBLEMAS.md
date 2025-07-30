# 🔧 Guia de Solução de Problemas - BeatConnect

## ❌ Erro: "supabase is not defined"

### 🔍 Diagnóstico

Este erro indica que a biblioteca do Supabase não está sendo carregada corretamente ou na ordem certa.

### ✅ Soluções Aplicadas

1. **Corrigido `supabase-config.js`**:
   - Mudança: `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` → `window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`
   - Removido: Seção de `export` que não é necessária

2. **Melhorado carregamento de scripts**:
   - Adicionado verificação de carregamento do Supabase
   - Garantido ordem correta: Supabase CDN → Verificação → Config

## ❌ Erro: "Invalid key" no upload de arquivos

### 🔍 Diagnóstico

Este erro ocorre quando o nome do arquivo contém caracteres especiais que não são permitidos pelo Supabase Storage.

### ✅ Soluções Aplicadas

1. **Adicionada função `sanitizeFileName`**:
   - Remove caracteres especiais e espaços
   - Converte para minúsculas
   - Substitui caracteres inválidos por underscore

2. **Atualizada função `submitBeat`**:
   - Agora usa `sanitizeFileName()` antes do upload
   - Garante compatibilidade com Supabase Storage

### 🧪 Como Testar

1. **Abra `teste-simples.html`** no navegador
2. **Verifique o console** (F12 → Console)
3. **Clique nos botões de teste**

**Para testar upload de arquivos:**
1. **Abra `teste-upload.html`** no navegador
2. **Teste a sanitização** de nomes de arquivos
3. **Teste o upload simulado** primeiro
4. **Teste o upload real** com um arquivo pequeno

### 📋 Checklist de Verificação

- [ ] **Conexão com internet** está funcionando
- [ ] **Script do Supabase** está carregando (ver console)
- [ ] **Arquivo `supabase-config.js`** existe no mesmo diretório
- [ ] **Credenciais do Supabase** estão corretas
- [ ] **Ordem dos scripts** está correta
- [ ] **Função `sanitizeFileName`** está disponível (para uploads)
- [ ] **Bucket `beats`** existe no Supabase Storage

### 🔧 Passos para Resolver

1. **Abra o navegador** e vá para `teste-simples.html`
2. **Pressione F12** para abrir as ferramentas do desenvolvedor
3. **Vá para a aba Console**
4. **Recarregue a página** (F5)
5. **Verifique se há erros** no console

### 📝 Possíveis Erros e Soluções

#### ❌ "Failed to load resource"
- **Causa**: Problema de conexão com a internet
- **Solução**: Verifique sua conexão

#### ❌ "supabase-config.js not found"
- **Causa**: Arquivo não está no local correto
- **Solução**: Verifique se o arquivo está na mesma pasta

#### ❌ "Invalid API key"
- **Causa**: Credenciais incorretas
- **Solução**: Verifique `SUPABASE_URL` e `SUPABASE_ANON_KEY`

#### ❌ "Invalid key" no upload
- **Causa**: Nome do arquivo com caracteres especiais
- **Solução**: Use `teste-upload.html` para verificar a sanitização

### 🎯 Próximos Passos

1. **Teste com `teste-simples.html`**
2. **Se funcionar**: Teste com `teste-conexao.html`
3. **Se funcionar**: Teste com `teste-upload.html` (upload de arquivos)
4. **Se funcionar**: Teste com `index.html` (envio de beats)
5. **Se funcionar**: Teste com `dashboard.html` (admin)

### 📞 Se Ainda Não Funcionar

1. **Copie o erro exato** do console
2. **Verifique se todos os arquivos** estão na mesma pasta
3. **Teste em outro navegador** (Chrome, Firefox, Edge)
4. **Desative extensões** do navegador temporariamente

### 🔗 Arquivos Importantes

- `teste-simples.html` - Teste básico de carregamento
- `teste-conexao.html` - Teste completo de funcionalidades
- `teste-upload.html` - Teste específico de upload de arquivos
- `supabase-config.js` - Configuração do Supabase
- `index.html` - Página de envio de beats
- `dashboard.html` - Painel administrativo

### 💡 Dica Importante

Sempre abra o **Console do navegador** (F12) para ver erros detalhados que podem ajudar a identificar o problema específico. 