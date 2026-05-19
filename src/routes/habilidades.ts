import express from 'express';
import db from '../../models/index.js';

const router = express.Router();

// Obtener todas las habilidades
router.get('/', async (req, res, next) => {
  try {
    const queryOptions: any = {};
    if (req.query.orden === 'estamina') {
      queryOptions.order = [['incremento_estamina', 'DESC']];
    }
    const habilidades = await db.Habilidad.findAll(queryOptions);
    res.json(habilidades);
  } catch (error) {
    next(error);
  }
});

export default router;
