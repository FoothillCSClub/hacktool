import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import { Feedback } from '../models';
import createFeedback from '../validators/createFeedback';

router.post('/', async (req: Request, res: Response) => {
    try {
        console.log('Hit')
        const validatedFeedbackItem = await createFeedback.validateAsync(req.body);
        const newPersistedFeedback = await Feedback.create(validatedFeedbackItem);
        return res.status(201).json(newPersistedFeedback);
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;