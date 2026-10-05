const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function me(req, res) {
  const user = await User.findById(req.user.id)

  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' })
  }

  res.json(user)
}

async function updateMe(req, res) {
  const dados = { nome: req.body.nome }

  if (req.user.role === 'medico') {
    dados.especialidade = req.body.especialidade
  }

  if (req.user.role === 'paciente') {
    dados.dataNascimento = req.body.dataNascimento
  }

  if (req.body.senha) {
    dados.senha = await bcrypt.hash(req.body.senha, 10)
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      dados,
      { new: true, runValidators: true }
    )

    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensagem: 'Dados inválidos' })
    }

    res.status(500).json({ mensagem: 'Erro ao atualizar perfil' })
  }
}

async function removeMe(req, res) {
  await User.findByIdAndDelete(req.user.id)
  res.json({ mensagem: 'Conta removida' })
}

async function listMedicos(req, res) {
  const medicos = await User
    .find({ role: 'medico' })
    .select('nome email crm especialidade')

  res.json(medicos)
}

async function listPacientes(req, res) {
  const pacientes = await User
    .find({ role: 'paciente' })
    .select('nome email dataNascimento')

  res.json(pacientes)
}

module.exports = {
  me,
  updateMe,
  removeMe,
  listMedicos,
  listPacientes
}
