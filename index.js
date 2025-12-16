import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import connectDB from './config/db.js';

import UserRouter from './routes/userRouter.js';
import StationRouter from './routes/stations.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());


connectDB();

app.use('/api', UserRouter); 
app.use('/api/stations', StationRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});