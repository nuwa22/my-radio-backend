import station from "../models/station.js";


export const getStations = async (req, res) => {
    try {
        const stations = await station.find();
        res.json(stations);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const addStation = async (req, res) => {
    try {
        const newStation = new station(req.body);
        const savedStation = await newStation.save();
        res.status(201).json(savedStation);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const deleteStation = async (req, res) => {
    try {
        await station.findByIdAndDelete(req.params.id);
        res.json("Station deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
};