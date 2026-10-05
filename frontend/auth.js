const api = '/api'

function trocarPerfil() {
  const medico = document.getElementById('roleCadastro').value === 'medico'

  document.getElementById('camposMedico').classList.toggle('hidden', !medico)
  document.getElementById('camposPaciente').classList.toggle('hidden', medico)
}

async function cadastrar() {
  const role = document.getElementById('roleCadastro').value
  const status = document.getElementById('statusCadastro')

  const body = {
    role,
    nome: document.getElementById('nomeCadastro').value,
    email: document.getElementById('emailCadastro').value,
    senha: document.getElementById('senhaCadastro').value
  }

  if (role === 'medico') {
    body.crm = document.getElementById('crmCadastro').value
    body.especialidade = document.getElementById('especialidadeCadastro').value
  } else {
    body.cpf = document.getElementById('cpfCadastro').value
    body.dataNascimento = document.getElementById('nascimentoCadastro').value
  }

  const resposta = await fetch(`${api}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    status.innerText = dados.mensagem
    return
  }

  status.innerText = `${dados.nome} cadastrado com sucesso. Faça login para entrar.`
}

async function login() {
  const email = document.getElementById('emailLogin').value
  const senha = document.getElementById('senhaLogin').value
  const status = document.getElementById('statusLogin')

  const resposta = await fetch(`${api}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      senha
    })
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    status.innerText = dados.mensagem

    return
  }

  localStorage.setItem('token', dados.token)
  localStorage.setItem('usuario', JSON.stringify(dados.usuario))

  window.location.href = '/usuarios.html'
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}