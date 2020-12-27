require('dotenv').config()

import mongoose from 'mongoose'
import express from 'express'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser';

import { IUser, User } from './models'
import { IFeedback, Feedback } from './models'
import createFeedback from './validators/createFeedback'

type GithubId = number;
interface JWTPayloadType {
  githubID: GithubId;
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      context: {
        user: IUser;
      }
    }
  }
}

const app = express()

mongoose.connect('mongodb://localhost/hacktool', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

async function generateJsonWebToken({ githubID, _id }: JWTPayloadType) {
  try {
    const token = await jwt.sign({ githubID, _id }, process.env.JSON_WEB_SECRET!, { expiresIn: '15 days' })
    return token
  } catch (error) {
    throw new Error(error)
  }
}

async function generateDecodedJsonWebToken(token: string) {
  try {
    const decoded = await jwt.verify(token, process.env.JSON_WEB_SECRET!) as JWTPayloadType

    return {
      githubID: decoded.githubID,
      _id: decoded._id,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getUserContext({ githubID, _id }: JWTPayloadType) {
  try {
    return User.findOne({ githubID: githubID, _id: _id }).exec();
  } catch (error) {
    throw new Error(error);
  }
}

async function checkToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    if (req.headers.authorization) {
      const rawBearerToken = req.headers.authorization || ''
      const token = rawBearerToken.split("Bearer ")[1]
      const data = await generateDecodedJsonWebToken(token)

      if (data) {
        const userContext = await getUserContext(data)

        if (userContext) {
          req.context = {
            ...req.context,
            user: userContext
          }

          return next()
        }
      }
    }

    res.status(401)
    return next(new Error('Unauthenticated'))
  } catch (err) {
    res.status(500)
    return next(err)
  }
}

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/me', checkToken, async (req, res) => {
  const { name, githubID, githubURL, avatarURL, skills } = req.context.user

  res.json({ name, githubID, githubURL, avatarURL, skills });
})


app.post('/debug-feedback', async (req, res) => {
  try {
    const value = await createFeedback.validateAsync(req.body);
    await Feedback.create(value);
    return res.status(201).send('Success!')
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.get('/github/login', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}`)
})

app.get('/github/callback', async (req, res) => {
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
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
    })
    const accessTokenData = await response.json()

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${accessTokenData.access_token}`
      }
    })
    const userData = await userResponse.json()

    let user = await User.findOne({ githubID: userData.id }).exec()

    if (!user) {
      user = await User.create({
        name: userData.name,
        githubID: userData.id,
        githubURL: userData.html_url,
        avatarURL: userData.avatar_url,
      })
    }

    const token = await generateJsonWebToken({
      githubID: userData.id,
      _id: user._id,
    })

    res.redirect(`${process.env.WEB_CLIENT_URL}/authorization-do-not-share/?token_do_not_share=${token}`)
  } catch (err) {
    res.status(500)
    res.json('We hit an error')
  }
})

app.listen(5050, () => {
  console.log('Server is listening at port 5050.')
})
