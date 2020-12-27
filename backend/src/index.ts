require('dotenv').config()

import * as mongoose from 'mongoose'
import express from 'express'
import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello world')
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

    const data = await response.json()
    const token = data.access_token

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${token}`
      }
    })
    const userData = await userResponse.json();

    res.json(userData)
  } catch (err) {
    res.status(500)
    res.json('We hit an error')
  }
})

app.listen(5050, () => {
  console.log('Server is listening at port 5050.')
})
