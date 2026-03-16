import station from "../models/station.js";


export const getStations = async (req, res) => {
    try {
        const stations = await station.find();
        res.json(stations);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateStation = async (req, res) => {
    try {
        const updatedStation = await station.findByIdAndUpdate(
            req.params.id,       
            { $set: req.body },  
            { new: true }        
        );
        res.status(200).json(updatedStation);
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

export const reportStation = async (req, res) => {
    try {
        const updatedStation = await station.findByIdAndUpdate(
            req.params.id,
            { $inc: { reports: 1 } }, 
            { new: true }
        );

        if (!updatedStation) {
            return res.status(404).json({ message: "Station not found" });
        }

        res.status(200).json({ 
            message: "Report received successfully",
            currentReports: updatedStation.reports // දැනට තියෙන මුළු රිපෝට් ගාණ
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getReportedStations = async (req, res) => {
    try {
        const reportedStations = await station.find({ reports: { $gt: 0 } }).sort({ reports: -1 });
        res.status(200).json(reportedStations);
    } catch (err) {
        res.status(500).json(err);
    }
};