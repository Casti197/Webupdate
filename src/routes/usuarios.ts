import express from 'express';
import db from '../../models/index.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await db.Usuario.findAll({
      include: [{ model: db.Perfil }]
    });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

// Personajes asociados a un usuario
router.get('/:id/personajes', async (req, res, next) => {
  try {
    const usuario = await db.Usuario.findByPk(req.params.id, {
      include: [
        {
          model: db.Perfil,
          include: [{ model: db.Personaje }]
        }
      ]
    });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const plain = usuario.get({ plain: true });
    // Perfil might be pluralized as Perfils or Perfiles depending on Sequelize
    const perfil = plain.Perfil || plain.Perfiles || plain.Perfils;
    const personajes = perfil?.Personajes || perfil?.Personajes || [];
    res.json(personajes);
  } catch (error) {
    next(error);
  }
});

export default router;
