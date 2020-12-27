import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import { User } from '../models';
import { extractToken } from '../utils/middleware';

router.get('/', extractToken, async (req: Request, res: Response) => {
    try {
        const user = await User.find({
            _id: req.context.user._id
        }).exec();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error);
    }
})

export default router;