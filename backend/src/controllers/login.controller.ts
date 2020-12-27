import express from 'express';
const router = express.Router()
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { User } from '../models';
import { generateJsonWebToken } from '../utils';

router.get('/login', (_req: Request, res: Response) => {
    return res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}`)
});

router.get('/callback', async (req: Request, res: Response) => {
    try {
        const accessTokenResponse = await (await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            body: JSON.stringify({
                client_id: process.env.GH_CLIENT_ID,
                client_secret: process.env.GH_CLIENT_SECRET,
                code: req.query.code
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })).json();

        const userProfileResponse = await (await fetch('https://api.github.com/user', {
            headers: {
                Accept: 'application/json',
                Authorization: `token ${accessTokenResponse.access_token}`
            }
        })).json();

        let user = await User.findOne({ githubID: userProfileResponse.id }).exec()

        if (!user) {
            user = await User.create({
                name: userProfileResponse.name,
                githubID: userProfileResponse.id,
                githubURL: userProfileResponse.html_url,
                avatarURL: userProfileResponse.avatar_url,
            })
        }

        const token = await generateJsonWebToken({
            githubID: userProfileResponse.id,
            _id: user._id,
        })

        return res.redirect(`${process.env.WEB_CLIENT_URL}/authorization-do-not-share/?token_do_not_share=${token}`)
    } catch (error) {
        return res.status(500).json(error)
    }
})

export default router;