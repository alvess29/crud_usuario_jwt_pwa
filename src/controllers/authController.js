const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

function camposDoPerfil({ role, crm, especialidade, cpf, dataNascimento }) {
  if (role === 'medico') return { crm, especialidade }
  if (role === 'paciente') return { cpf, dataNascimento }
  return {}
}

async function register(req, res) {
  const { nome, email, senha, role } = req.body

  if (!senha || senha.length < 6) {
    return res.status(400).json({
      mensagem: 'A senha deve ter pelo menos 6 caracteres'
    })
  }

  try {
    const user = await User.create({
      nome,
      email,
      senha: await bcrypt.hash(senha, 10),
      role,
      ...camposDoPerfil(req.body)
    })

    res.status(201).json(user)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensagem: 'E-mail, CRM ou CPF já cadastrado'
      })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        mensagem: 'Preencha todos os campos obrigatórios do perfil escolhido'
      })
    }

    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' })
  }
}

async function login(req, res) {
  const user = await User.findOne({
    email: req.body.email?.toLowerCase().trim()
  })

  if (!user) {
    return res.status(401).json({
      mensagem: 'E-mail ou senha inválidos'
    })
  }

  const senhaValida = await bcrypt.compare(
    req.body.senha,
    user.senha
  )

  if (!senhaValida) {
    return res.status(401).json({
      mensagem: 'E-mail ou senha inválidos'
    })
  }

  const token = jwt.sign(
    {
      id: user._id,
      nome: user.nome,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  res.json({
    token,
    usuario: user
  })
}

module.exports = {
  register,
  login
}
