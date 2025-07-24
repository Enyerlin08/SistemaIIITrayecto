import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt';

export function verificarToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        (req as any).usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
