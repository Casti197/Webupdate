import { Request, Response, NextFunction } from 'express';

export const requireRole = (requiredRole: string) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (user.role !== requiredRole) {
    return res.status(403).json({
      error: `Acceso prohibido. Se requiere rol ${requiredRole}.`
    });
  }

  next();
};
