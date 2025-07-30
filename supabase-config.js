// BeatConnect - Supabase Configuration
// Substitua pelas suas credenciais do Supabase

const SUPABASE_URL = 'https://wzcvvsvvlllfwtydbict.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y3Z2c3Z2bGxsZnd0eWRiaWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDI2OTAsImV4cCI6MjA2OTQxODY5MH0.Y1jY06R6wgORf_hHrgG7K25PumF4jhSq_ors_pu4Qns'

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ===== FUNÇÕES PARA ENVIO DE BEATS =====

/**
 * Envia um beat para o banco de dados
 * @param {Object} beatData - Dados do beat
 * @param {string} beatData.producer_name - Nome do produtor
 * @param {string} beatData.beat_title - Título do beat
 * @param {string} beatData.message - Mensagem opcional
 * @param {File} beatData.file - Arquivo do beat
 * @returns {Promise<Object>} Resultado da operação
 */
async function submitBeat(beatData) {
    try {
        // 1. Upload do arquivo para o storage
        const sanitizedName = sanitizeFileName(beatData.file.name)
        const fileName = `${Date.now()}_${sanitizedName}`
        const { data: fileData, error: fileError } = await supabase.storage
            .from('beats')
            .upload(fileName, beatData.file)

        if (fileError) {
            throw new Error(`Erro no upload: ${fileError.message}`)
        }

        // 2. Obter URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
            .from('beats')
            .getPublicUrl(fileName)

        // 3. Salvar dados no banco
        const { data, error } = await supabase
            .from('beats')
            .insert([
                {
                    producer_name: beatData.producer_name,
                    beat_title: beatData.beat_title,
                    message: beatData.message || '',
                    file_url: publicUrl,
                    status: 'pending'
                }
            ])
            .select()

        if (error) {
            throw new Error(`Erro ao salvar: ${error.message}`)
        }

        return { success: true, data }
    } catch (error) {
        console.error('Erro ao enviar beat:', error)
        return { success: false, error: error.message }
    }
}

// ===== FUNÇÕES PARA DASHBOARD ADMIN =====

/**
 * Autentica um administrador
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 * @returns {Promise<Object>} Resultado da autenticação
 */
async function authenticateAdmin(username, password) {
    try {
        // Em produção, use bcrypt para verificar a senha
        const { data, error } = await supabase
            .from('admin_auth')
            .select('*')
            .eq('username', username)
            .single()

        if (error || !data) {
            return { success: false, error: 'Usuário não encontrado' }
        }

        // Verificação simples (em produção, use bcrypt)
        if (password === 'admin123') {
            return { success: true, data }
        } else {
            return { success: false, error: 'Senha incorreta' }
        }
    } catch (error) {
        console.error('Erro na autenticação:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Busca todos os beats
 * @returns {Promise<Array>} Lista de beats
 */
async function getAllBeats() {
    try {
        const { data, error } = await supabase
            .from('beats')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Erro ao buscar beats: ${error.message}`)
        }

        return { success: true, data }
    } catch (error) {
        console.error('Erro ao buscar beats:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Atualiza o status de um beat
 * @param {number} beatId - ID do beat
 * @param {string} status - Novo status
 * @returns {Promise<Object>} Resultado da atualização
 */
async function updateBeatStatus(beatId, status) {
    try {
        const { data, error } = await supabase
            .from('beats')
            .update({ status })
            .eq('id', beatId)
            .select()

        if (error) {
            throw new Error(`Erro ao atualizar status: ${error.message}`)
        }

        return { success: true, data }
    } catch (error) {
        console.error('Erro ao atualizar status:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Exclui um beat
 * @param {number} beatId - ID do beat
 * @returns {Promise<Object>} Resultado da exclusão
 */
async function deleteBeat(beatId) {
    try {
        // 1. Buscar informações do beat para excluir o arquivo
        const { data: beatData, error: fetchError } = await supabase
            .from('beats')
            .select('file_url')
            .eq('id', beatId)
            .single()

        if (fetchError) {
            throw new Error(`Erro ao buscar beat: ${fetchError.message}`)
        }

        // 2. Extrair nome do arquivo da URL
        const fileName = beatData.file_url.split('/').pop()

        // 3. Excluir arquivo do storage
        const { error: storageError } = await supabase.storage
            .from('beats')
            .remove([fileName])

        if (storageError) {
            console.warn('Erro ao excluir arquivo:', storageError)
        }

        // 4. Excluir registro do banco
        const { error: dbError } = await supabase
            .from('beats')
            .delete()
            .eq('id', beatId)

        if (dbError) {
            throw new Error(`Erro ao excluir beat: ${dbError.message}`)
        }

        return { success: true }
    } catch (error) {
        console.error('Erro ao excluir beat:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Busca estatísticas dos beats
 * @returns {Promise<Object>} Estatísticas
 */
async function getBeatStats() {
    try {
        const { data, error } = await supabase
            .from('beats')
            .select('status')

        if (error) {
            throw new Error(`Erro ao buscar estatísticas: ${error.message}`)
        }

        const stats = {
            total: data.length,
            pending: data.filter(beat => beat.status === 'pending').length,
            viewed: data.filter(beat => beat.status === 'viewed').length,
            downloaded: data.filter(beat => beat.status === 'downloaded').length,
            rejected: data.filter(beat => beat.status === 'rejected').length
        }

        return { success: true, data: stats }
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return { success: false, error: error.message }
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====

/**
 * Formata data para exibição
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Sanitiza o nome do arquivo para ser compatível com o Supabase Storage
 * @param {string} fileName - Nome original do arquivo
 * @returns {string} Nome sanitizado
 */
function sanitizeFileName(fileName) {
    // Remove caracteres especiais e espaços, mantém apenas letras, números, pontos e hífens
    return fileName
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Substitui caracteres especiais por underscore
        .replace(/_+/g, '_') // Remove underscores múltiplos
        .replace(/^_|_$/g, '') // Remove underscores no início e fim
        .toLowerCase() // Converte para minúsculas
}

/**
 * Valida arquivo de beat
 * @param {File} file - Arquivo para validar
 * @returns {Object} Resultado da validação
 */
function validateBeatFile(file) {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3']
    const maxSize = 50 * 1024 * 1024 // 50MB

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Apenas arquivos .mp3 e .wav são permitidos' }
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Arquivo muito grande. Máximo 50MB' }
    }

    return { valid: true }
}

// ===== FUNÇÕES DISPONÍVEIS GLOBALMENTE =====

// Todas as funções estão disponíveis globalmente:
// - submitBeat(beatData)
// - authenticateAdmin(username, password)
// - getAllBeats()
// - updateBeatStatus(beatId, status)
// - deleteBeat(beatId)
// - getBeatStats()
// - formatDate(dateString)
// - validateBeatFile(file)
// - sanitizeFileName(fileName)

// ===== CONFIGURAÇÃO DE POLÍTICAS RLS =====

/*
Para configurar as políticas de segurança no Supabase, execute estes comandos SQL:

-- Habilitar RLS nas tabelas
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

-- Políticas para beats
CREATE POLICY "Allow beat insertion" ON beats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read" ON beats
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update" ON beats
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete" ON beats
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para storage
CREATE POLICY "Allow file uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'beats');

CREATE POLICY "Allow admin downloads" ON storage.objects
    FOR SELECT USING (bucket_id = 'beats' AND auth.role() = 'authenticated');
*/ 