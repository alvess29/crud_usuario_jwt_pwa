const seguro = [{ bearerAuth: [] }]

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Médicos e Pacientes',
    version: '1.0.0'
  },
  servers: [
    {
      url: '/'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Medico: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'role', 'crm', 'especialidade'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string' },
          senha: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['medico'] },
          crm: { type: 'string' },
          especialidade: { type: 'string' }
        }
      },
      Paciente: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'role', 'cpf', 'dataNascimento'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string' },
          senha: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['paciente'] },
          cpf: { type: 'string' },
          dataNascimento: { type: 'string', format: 'date' }
        }
      },
      Login: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          senha: { type: 'string' }
        }
      },
      AtualizacaoPerfil: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          senha: { type: 'string' },
          especialidade: { type: 'string' },
          dataNascimento: { type: 'string', format: 'date' }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Cadastra médico ou paciente',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/Medico' },
                  { $ref: '#/components/schemas/Paciente' }
                ]
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuário cadastrado' },
          400: { description: 'Dados inválidos' },
          409: { description: 'E-mail, CRM ou CPF já cadastrado' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Realiza login',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Login' }
            }
          }
        },
        responses: {
          200: { description: 'Login realizado' },
          401: { description: 'E-mail ou senha inválidos' }
        }
      }
    },
    '/api/users/me': {
      get: {
        summary: 'Retorna o perfil do usuário logado',
        tags: ['Usuários'],
        security: seguro,
        responses: {
          200: { description: 'Perfil do usuário' }
        }
      },
      put: {
        summary: 'Atualiza o perfil do usuário logado',
        tags: ['Usuários'],
        security: seguro,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AtualizacaoPerfil' }
            }
          }
        },
        responses: {
          200: { description: 'Perfil atualizado' }
        }
      },
      delete: {
        summary: 'Remove a conta do usuário logado',
        tags: ['Usuários'],
        security: seguro,
        responses: {
          200: { description: 'Conta removida' }
        }
      }
    },
    '/api/users/medicos': {
      get: {
        summary: 'Lista médicos',
        tags: ['Usuários'],
        security: seguro,
        responses: {
          200: { description: 'Lista de médicos' }
        }
      }
    },
    '/api/users/pacientes': {
      get: {
        summary: 'Lista pacientes (apenas médicos)',
        tags: ['Usuários'],
        security: seguro,
        responses: {
          200: { description: 'Lista de pacientes' },
          403: { description: 'Acesso negado' }
        }
      }
    }
  }
}

module.exports = swaggerSpec
