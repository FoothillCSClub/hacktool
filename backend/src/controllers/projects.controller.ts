import { extractToken } from "../utils/middleware";
import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import createProject from "../validators/createProject";
import Project from "../models/Project";

router.post('/', extractToken, async (req: Request, res: Response) => {
    try {
        const userID = req.context.user._id;
        const value = await createProject.validateAsync(req.body);

        const newProject = await Project.create({
            leader: userID,
            members: [userID],
            ...value
        });

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



export default router;