const api = '/api'
const token = localStorage.getItem('token')
const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/'
}

function escapar(texto) {
  const elemento = document.createElement('span')
  elemento.textContent = texto ?? ''
  return elemento.innerHTML
}

async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(`${api}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (resposta.status === 401) {
    logout()
    return
  }

  return resposta
}

async function carregarPerfil() {
  const resposta = await requisitar('/users/me')
  if (!resposta) return

  const perfil = await resposta.json()

  document.getElementById('nomePerfil').value = perfil.nome
  document.getElementById('emailPerfil').value = perfil.email

  if (perfil.role === 'medico') {
    document.getElementById('crmPerfil').value = perfil.crm
    document.getElementById('especialidadePerfil').value = perfil.especialidade
  } else {
    document.getElementById('cpfPerfil').value = perfil.cpf
    document.getElementById('nascimentoPerfil').value = perfil.dataNascimento.slice(0, 10)
  }
}

async function salvarPerfil() {
  const status = document.getElementById('statusPerfil')

  const body = {
    nome: document.getElementById('nomePerfil').value,
    senha: document.getElementById('senhaPerfil').value
  }

  if (usuario.role === 'medico') {
    body.especialidade = document.getElementById('especialidadePerfil').value
  } else {
    body.dataNascimento = document.getElementById('nascimentoPerfil').value
  }

  const resposta = await requisitar('/users/me', {
    method: 'PUT',
    body: JSON.stringify(body)
  })
  if (!resposta) return

  if (!resposta.ok) {
    const erro = await resposta.json()
    status.innerText = erro.mensagem
    return
  }

  document.getElementById('senhaPerfil').value = ''
  status.innerText = 'Perfil atualizado com sucesso'
}

async function excluirConta() {
  if (!confirm('Deseja realmente excluir sua conta?')) return

  const resposta = await requisitar('/users/me', { method: 'DELETE' })
  if (resposta) logout()
}

function detalhesDoUsuario(item) {
  if (usuario.role === 'medico') {
    const nascimento = new Date(item.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    return `Nascimento: ${nascimento}`
  }

  return `${item.especialidade} | CRM ${item.crm}`
}

async function listarUsuarios() {
  const caminho = usuario.role === 'medico' ? '/users/pacientes' : '/users/medicos'
  const resposta = await requisitar(caminho)
  if (!resposta) return

  const itens = await resposta.json()
  const div = document.getElementById('usuarios')

  div.innerHTML = itens.map(item => `
    <article class="user-item">
      <div class="user-info">
        <div class="avatar">${escapar(item.nome.charAt(0).toUpperCase())}</div>
        <div>
          <strong>${escapar(item.nome)}</strong>
          <span>${escapar(item.email)}</span>
          <small>${escapar(detalhesDoUsuario(item))}</small>
        </div>
      </div>
    </article>
  `).join('')
}

function iniciar() {
  const medico = usuario.role === 'medico'

  document.getElementById('tipoUsuario').innerText = medico ? 'Médico' : 'Paciente'
  document.getElementById('boasVindas').innerText = `Olá, ${usuario.nome}`
  document.getElementById('tituloLista').innerText = medico ? 'Pacientes cadastrados' : 'Médicos disponíveis'
  document.getElementById('descricaoLista').innerText = medico
    ? 'Consulte os pacientes cadastrados.'
    : 'Consulte os médicos e suas especialidades.'
  document.getElementById('perfilMedico').classList.toggle('hidden', !medico)
  document.getElementById('perfilPaciente').classList.toggle('hidden', medico)

  carregarPerfil()
  listarUsuarios()
}

if (token && usuario) {
  iniciar()
} else {
  logout()
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}
