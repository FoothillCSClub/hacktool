import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import { Feedback } from '../models';
import createFeedback from '../validators/createFeedback';

router.post('/', async (req: Request, res: Response) => {
    try {
        const value = await createFeedback.validateAsync(req.body);
        await Feedback.create(value);
        return res.status(201).send('Success!')
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;