require('dotenv').config()

import mongoose from 'mongoose'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser';
import { JWTPayloadType } from './utils';

import projectsController from './controllers/projects.controller';
import debugFeedbackController from './controllers/debug-feedback.controller';
import loginController from './controllers/login.controller';
import meController from './controllers/me.controller'

declare global {
  namespace Express {
    interface Request {
      context: {
        user: JWTPayloadType;
      }
    }
  }
}

mongoose.connect('mongodb://localhost/hacktool', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.use('/project', projectsController);
app.use('/debug-feedback', debugFeedbackController)
app.use('/github', loginController)

app.use('/me', meController)

app.listen(5050, () =>
  console.log('HackTool API 👾 is running at http://localhost:5050')
)
