import * as mongoose from 'mongoose';
import express from 'express';
import * as fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(5050, () => {
    console.log('Server is listening at port 5050.')
});
