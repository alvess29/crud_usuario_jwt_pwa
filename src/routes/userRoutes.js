const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.get('/me', authMiddleware, userController.me)
router.put('/me', authMiddleware, userController.updateMe)
router.delete('/me', authMiddleware, userController.removeMe)

router.get('/medicos', authMiddleware, userController.listMedicos)
router.get('/pacientes', authMiddleware, roleMiddleware('medico'), userController.listPacientes)

module.exports = router
