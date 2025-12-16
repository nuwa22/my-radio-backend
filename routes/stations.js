import express from 'express';
import { getStations, addStation, deleteStation } from '../controllers/stationController.js';
import verifyJWT from '../middleware/auth.js';

const StationRouter = express.Router();

StationRouter.get('/', getStations);
StationRouter.post('/', verifyJWT, addStation);
StationRouter.delete('/:id', verifyJWT, deleteStation);

export default StationRouter;