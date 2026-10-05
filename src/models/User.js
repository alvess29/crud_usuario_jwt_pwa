const mongoose = require('mongoose')

const ehMedico = function () {
  return this.role === 'medico'
}

const ehPaciente = function () {
  return this.role === 'paciente'
}

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['paciente', 'medico'],
    required: true
  },
  crm: {
    type: String,
    required: ehMedico,
    unique: true,
    sparse: true
  },
  especialidade: {
    type: String,
    required: ehMedico
  },
  cpf: {
    type: String,
    required: ehPaciente,
    unique: true,
    sparse: true
  },
  dataNascimento: {
    type: Date,
    required: ehPaciente
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.senha
      delete ret.__v
      return ret
    }
  }
})

module.exports = mongoose.model('User', userSchema)
