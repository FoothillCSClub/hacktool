import { extractToken } from "../utils/middleware";
import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import createProject from "../validators/createProject";
import Project from "../models/Project";
import { User } from "../models";
import updateProject from "../validators/updateProject";

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

/**
 * TODO(1) Add Pagination to this GET
 */
router.get('/withUser', extractToken, async (req: Request, res: Response) => {
    try {

        const user = await User
            .findById({
                _id: req.context.user._id
            }).exec();

        if (!user) throw Error('User not found in DB!')

        const projects = await Project
            .find()
            .populate('members')
            .populate('leader')
            .exec();


        return res.status(200).json({
            projects,
            user
        });
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.put('/:id', extractToken, async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updated = await Project
            .findOneAndUpdate({ _id: id, leaderID: req.context.user._id }, req.body)
            .exec();
        return res.status(204).json(updated);
    } catch (error) {
        return res.status(500).send(error);
    }
});

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