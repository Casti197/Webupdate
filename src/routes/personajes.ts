import express from 'express';
import db from '../../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Obtener todos los personajes
router.get('/', async (req, res, next) => {
  try {
    const { nombre } = req.query;
    const where: any = {};
    if (nombre) {
      where.nombre = { [Op.like]: `%${nombre}%` };
    }

    const personajesModels = await db.Personaje.findAll({
      where,
      include: [
        { model: db.Perfil },
        { 
          model: db.Habilidad,
          through: { attributes: ['nivel'] }
        }
      ]
    });

    // Mapear para que coincida con la interfaz del frontend
    const personajes = personajesModels.map((p: any) => {
      const plain = p.get({ plain: true });
      // Sequelize pluraliza Habilidad como Habilidads por defecto, pero a veces depende del locale
      const hList = plain.Habilidads || plain.Habilidades || [];
      return {
        ...plain,
        // El frontend espera 'habilidades' como un array de IDs
        habilidades: hList.map((h: any) => h.id)
      };
    });

    res.json(personajes);
  } catch (error) {
    next(error);
  }
});

// Obtener un personaje por ID
router.get('/:id', async (req, res, next) => {
  try {
    const personaje = await db.Personaje.findByPk(req.params.id, {
      include: [
        { model: db.Perfil },
        { 
          model: db.Habilidad,
          through: { attributes: ['nivel'] }
        }
      ]
    });
    if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });
    res.json(personaje);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo personaje
router.post('/', async (req, res, next) => {
  try {
    const { nombre, descripcion, ataque, defensa, estamina, perfilId } = req.body;
    const nuevoPersonaje = await db.Personaje.create({
      nombre,
      descripcion,
      ataque,
      defensa,
      estamina,
      perfilId
    });
    res.status(201).json(nuevoPersonaje);
  } catch (error) {
    next(error);
  }
});

// Editar un personaje
router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, descripcion, ataque, defensa, estamina } = req.body;
    const personaje = await db.Personaje.findByPk(req.params.id);
    if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });

    await personaje.update({ nombre, descripcion, ataque, defensa, estamina });
    res.json(personaje);
  } catch (error) {
    next(error);
  }
});

// Eliminar un personaje
router.delete('/:id', async (req, res, next) => {
  try {
    const personaje = await db.Personaje.findByPk(req.params.id);
    if (!personaje) return res.status(404).json({ error: 'Personaje no encontrado' });

    await personaje.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Agregar una habilidad al personaje
router.post('/:id/habilidades', async (req, res, next) => {
  try {
    const { habilidadId, nivel } = req.body;
    const personaje = await db.Personaje.findByPk(req.params.id);
    const habilidad = await db.Habilidad.findByPk(habilidadId);

    if (!personaje || !habilidad) {
      return res.status(404).json({ error: 'Personaje o Habilidad no encontrada' });
    }

    await personaje.addHabilidad(habilidad, { through: { nivel: nivel || 1 } });
    res.status(201).json({ message: 'Habilidad agregada correctamente' });
  } catch (error) {
    next(error);
  }
});

// Quitar una habilidad del personaje
router.delete('/:idP/habilidades/:idH', async (req, res, next) => {
  try {
    const personaje = await db.Personaje.findByPk(req.params.idP);
    const habilidad = await db.Habilidad.findByPk(req.params.idH);

    if (!personaje || !habilidad) {
      return res.status(404).json({ error: 'Personaje o Habilidad no encontrada' });
    }

    await personaje.removeHabilidad(habilidad);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
