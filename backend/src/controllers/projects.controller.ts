import { extractToken } from "../utils/middleware";
import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import createProject from "../validators/createProject";
import Project from "../models/Project";

/**
 * TODO(1) Add Pagination to this GET
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await Project
            .find()
            .populate('members')
            .populate('leader')
            .exec();

        return res.status(200).json({
            projects
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.post('/', extractToken, async (req: Request, res: Response) => {
    try {
        const userID = req.context.user._id;
        const value = await createProject.validateAsync(req.body);

        if (req.body.projectURL) {
            const working = String(req.body.projectURL);
            const isGithubOrigin = working.startsWith("https://github.com");
            if (!isGithubOrigin) throw new Error('Project URL is not from Github')
        }

        const newProject = await Project.create({
            leader: userID,
            leaderID: userID,
            members: [userID],
            ...value
        });

        return res.status(201).json(newProject);
    } catch (error) {
        return res.status(500).send(error);
    }
})



export default router;