import { extractToken } from "../utils/middleware";
import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import createProject from "../validators/createProject";
import Project from "../models/Project";

router.post('/', extractToken, async (req: Request, res: Response) => {
    try {
        const value = await createProject.validateAsync({
            leader: String(req.context.user._id),
            members: [String(req.context.user._id)],
            ...req.body
        });
        const newProject = await Project.create(value);
        return res.status(201).json(newProject);
    } catch (error) {
        return res.status(500).send(error);
    }
})

/**
 * TODO(1) Add Pagination to this GET
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().exec();
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).send(error);
    }
})

// /project/my-projects
router.get('/my-projects', extractToken, async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({ members: req.context.user._id }).exec();
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).send(error);
    }
});


export default router;