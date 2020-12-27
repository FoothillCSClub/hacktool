import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import { User } from '../models';
import Project from '../models/Project';
import { extractToken } from '../utils/middleware';

router.get('/', extractToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById({
            _id: req.context.user._id
        }).exec();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.get('/dashboard', extractToken, async (req: Request, res: Response) => {
    try {

        const user = await User
            .findById({
                _id: req.context.user._id
            }).exec();

        const projects = await Project
            .find({ members: req.context.user._id })
            .populate('members')
            .populate('leader')
            .exec();

        return res.status(200).json({ user, projects });
    } catch (error) {
        return res.status(500).send(error);
    }
})

export default router;