import express from 'express';
import { getStations, addStation, deleteStation, updateStation } from '../controllers/stationController.js';
import verifyJWT from '../middleware/auth.js';

const StationRouter = express.Router();

StationRouter.get('/', getStations);
StationRouter.post('/', verifyJWT, addStation);
StationRouter.put("/:id", verifyJWT, updateStation);
StationRouter.delete('/:id', verifyJWT, deleteStation);

export default StationRouter;