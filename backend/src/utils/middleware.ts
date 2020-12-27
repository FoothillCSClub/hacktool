import { generateDecodedJsonWebToken } from './index';
import { Request, Response, NextFunction } from 'express';

export async function extractToken(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.headers.authorization) {
            const rawBearerToken = req.headers.authorization || ''
            const token = rawBearerToken.split("Bearer ")[1]
            const data = await generateDecodedJsonWebToken(token)

            if (data) {
                req.context = {
                    ...req.context,
                    user: data
                }
                return next()
            }
        }

        res.status(401)
        return next(new Error('Unauthenticated'))
    } catch (err) {
        res.status(500)
        return next(err)
    }
}