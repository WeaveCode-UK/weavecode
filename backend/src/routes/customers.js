import express from 'express'
import { Customer } from '../lib/models.js'
import { getCache, setCache, deleteCache } from '../lib/redis.js'

const router = express.Router()

// Middleware para verificar se o usuário está autenticado
const requireAuth = (req, res, next) => {
  // Implementar verificação de JWT aqui
  next()
}

// GET /api/customers - Listar todos os clientes (com cache)
router.get('/', requireAuth, async (req, res) => {
  try {
    const cacheKey = 'customers:all'
    
    // Tentar obter do cache primeiro
    let customers = await getCache(cacheKey)
    
    if (customers) {
      console.log('📦 Customers obtidos do cache Redis')
      return res.json({
        success: true,
        data: customers,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // Se não estiver no cache, buscar do banco
    console.log('🗄️ Buscando customers do PostgreSQL')
    customers = await Customer.findAll()
    
    // Salvar no cache por 5 minutos (300 segundos)
    await setCache(cacheKey, customers, 300)
    console.log('💾 Customers salvos no cache Redis')
    
    res.json({
      success: true,
      data: customers,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao buscar customers:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// GET /api/customers/:id - Buscar cliente por ID (com cache)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const cacheKey = `customer:${id}`
    
    // Tentar obter do cache primeiro
    let customer = await getCache(cacheKey)
    
    if (customer) {
      console.log(`📦 Customer ${id} obtido do cache Redis`)
      return res.json({
        success: true,
        data: customer,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // Se não estiver no cache, buscar do banco
    console.log(`🗄️ Buscando customer ${id} do PostgreSQL`)
    customer = await Customer.findById(id)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      })
    }
    
    // Salvar no cache por 10 minutos (600 segundos)
    await setCache(cacheKey, customer, 600)
    console.log(`💾 Customer ${id} salvo no cache Redis`)
    
    res.json({
      success: true,
      data: customer,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao buscar customer:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// POST /api/customers - Criar novo cliente
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nome e email são obrigatórios'
      })
    }
    
    const customer = await Customer.create({ name, email, phone, notes })
    
    // Limpar cache de customers para refletir mudanças
    await deleteCache('customers:all')
    console.log('🧹 Cache de customers limpo após criação')
    
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Cliente criado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao criar customer:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// PUT /api/customers/:id - Atualizar cliente
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const customer = await Customer.update(id, updates)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      })
    }
    
    // Limpar caches relacionados
    await deleteCache(`customer:${id}`)
    await deleteCache('customers:all')
    console.log(`🧹 Cache de customer ${id} e customers:all limpos após atualização`)
    
    res.json({
      success: true,
      data: customer,
      message: 'Cliente atualizado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar customer:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// DELETE /api/customers/:id - Deletar cliente
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    
    const customer = await Customer.delete(id)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      })
    }
    
    // Limpar caches relacionados
    await deleteCache(`customer:${id}`)
    await deleteCache('customers:all')
    console.log(`🧹 Cache de customer ${id} e customers:all limpos após deleção`)
    
    res.json({
      success: true,
      data: customer,
      message: 'Cliente deletado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao deletar customer:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

// GET /api/customers/stats - Estatísticas dos clientes (com cache)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const cacheKey = 'customers:stats'
    
    // Tentar obter do cache primeiro
    let stats = await getCache(cacheKey)
    
    if (stats) {
      console.log('📦 Stats obtidos do cache Redis')
      return res.json({
        success: true,
        data: stats,
        source: 'cache',
        timestamp: new Date().toISOString()
      })
    }
    
    // Se não estiver no cache, calcular do banco
    console.log('🗄️ Calculando stats do PostgreSQL')
    const allCustomers = await Customer.findAll()
    
    stats = {
      total: allCustomers.length,
      withPhone: allCustomers.filter(c => c.phone).length,
      withNotes: allCustomers.filter(c => c.notes).length,
      createdThisMonth: allCustomers.filter(c => {
        const created = new Date(c.created_at)
        const now = new Date()
        return created.getMonth() === now.getMonth() && 
               created.getFullYear() === now.getFullYear()
      }).length
    }
    
    // Salvar no cache por 15 minutos (900 segundos)
    await setCache(cacheKey, stats, 900)
    console.log('💾 Stats salvos no cache Redis')
    
    res.json({
      success: true,
      data: stats,
      source: 'database',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erro ao calcular stats:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
})

export default router


