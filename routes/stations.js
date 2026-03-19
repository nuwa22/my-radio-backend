import express from 'express';
import { getStations, addStation, deleteStation, updateStation, reportStation, getReportedStations, getAvailableCountries } from '../controllers/stationController.js';
import verifyJWT from '../middleware/auth.js';

const StationRouter = express.Router();

StationRouter.get('/', getStations);
StationRouter.get('/reported-list', verifyJWT, getReportedStations);
StationRouter.post('/', verifyJWT, addStation);
StationRouter.put("/:id", verifyJWT, updateStation);
StationRouter.delete('/:id', verifyJWT, deleteStation);
StationRouter.post('/:id/report', reportStation);
StationRouter.get('/countries/list', getAvailableCountries);

export default StationRouter;