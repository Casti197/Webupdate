import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';

const { Usuario } = db;

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, correo, password } = req.body;

    const existingUser = await db.Usuario.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { correo }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o correo ya está en uso' });
    }

    const newUser = await db.Usuario.create({
      username,
      correo,
      password,
      role: 'USER'
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        correo: newUser.correo,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username y password son requeridos' });
    }

    // Usar scope(null) para incluir el password si es necesario, 
    // o simplemente confiar en que el modelo lo tiene si no hay default scope.
    // En el paso anterior agregué un defaultScope para excluir password.
    const user = await Usuario.scope(null).findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret_key_placeholder',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any }
    );

    res.json({
      token,
      token_type: 'bearer',
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response) => {
  // req.user fue inyectado por el middleware authJwt
  // Nota: necesitamos extender el tipo de Request para incluir user
  res.json((req as any).user);
};
