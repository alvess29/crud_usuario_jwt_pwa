# Médicos e Pacientes com JWT e PWA

Projeto didático simples com:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Swagger
- HTML
- CSS
- JavaScript
- PWA

## Estrutura

```text
crud_usuario_jwt_pwa/
├── frontend/
│   ├── auth.js
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   ├── style.css
│   ├── usuarios.html
│   └── usuarios.js
├── src/
│   ├── config/
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Executar

1. Instale o MongoDB localmente ou use MongoDB Atlas.
2. Copie `.env.example` para `.env`.
3. Ajuste `MONGO_URI`.
4. Instale as dependências:

```bash
npm install
```

5. Execute:

```bash
npm run dev
```

6. Abra:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api-docs
```

## Fluxo

1. Na tela inicial, cadastre-se como paciente (CPF e data de nascimento) ou como médico (CRM e especialidade).
2. Faça login. O token JWT é salvo no `localStorage`.
3. No painel, médicos veem a lista de pacientes e pacientes veem a lista de médicos.
4. Cada usuário pode editar ou excluir o próprio perfil.

## Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
GET    /api/users/medicos
GET    /api/users/pacientes   (apenas médicos)
```

## Frontend

A aplicação possui duas telas:

- `/` contém login e cadastro público.
- `/usuarios.html` contém o painel protegido e redireciona para o login quando não existe token JWT no navegador.
