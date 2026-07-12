import station from "../models/station.js";
import axios from "axios";

export const getStations = async (req, res) => {
    try {
        const countryFilter = req.query.country;
        const { genre, mood, era } = req.query;

        let query = {};

        // Logic for filtering by country
        if (countryFilter && countryFilter !== "All") {
            query.country = countryFilter;
        } 
        else if (!countryFilter) {
            query.country = "Sri Lanka";
        }

        // Filters for genres, moods, and eras
        if (genre) {
            query.genres = genre;
        }
        if (mood) {
            query.moods = mood;
        }
        if (era) {
            query.eras = era;
        }

        const stations = await station.find(query).sort({ name: 1 });
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
            currentReports: updatedStation.reports 
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

// Database එකේ ඇති රටවල් ලැයිස්තුව පමණක් ලබා ගැනීම
export const getAvailableCountries = async (req, res) => {
    try {
        // distinct පාවිච්චි කරලා unique රටවල් ටික විතරක් ගන්නවා
        const countries = await station.distinct("country");
        // null හෝ හිස් අගයන් අයින් කරලා පිරිසිදු ලිස්ට් එකක් යවනවා
        const filteredCountries = countries.filter(Boolean).sort();
        res.json(filteredCountries);
    } catch (err) {
        res.status(500).json({ message: "Error fetching countries", error: err });
    }
};

export const semanticSearch = async (req, res) => {
    try {
        const queryText = req.query.q;
        if (!queryText) {
            return res.status(400).json({ message: "Search query is required" });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: "GROQ_API_KEY is not configured" });
        }

        // Call GROQ to map search query to genre, mood, era tags
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert search query parser. Extract search intents from the user's natural language input.
Your response MUST be raw JSON output only. No explanations, no markdown formatting.
Output format:
{
  "genres": ["lofi", "jazz", "classical", "pop", "rock", "news", "talk", "devotional"],
  "moods": ["chill", "focus", "energizing", "happy", "relaxing"],
  "eras": ["modern", "retro", "90s", "80s", "70s"]
}
Only extract items from these predefined lists. If no match is found, return empty array for that field.`
                    },
                    {
                        role: 'user',
                        content: queryText
                    }
                ],
                model: 'llama-3.1-8b-instant',
                response_format: { type: 'json_object' }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY.replace(/^['"]|['"]$/g, '').trim()}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const parsedTags = JSON.parse(response.data.choices[0].message.content);

        // Build MongoDB Query
        let orConditions = [];

        if (parsedTags.genres && parsedTags.genres.length > 0) {
            orConditions.push({ genres: { $in: parsedTags.genres.map(g => new RegExp(`^${g}$`, 'i')) } });
        }
        if (parsedTags.moods && parsedTags.moods.length > 0) {
            orConditions.push({ moods: { $in: parsedTags.moods.map(m => new RegExp(`^${m}$`, 'i')) } });
        }
        if (parsedTags.eras && parsedTags.eras.length > 0) {
            orConditions.push({ eras: { $in: parsedTags.eras.map(e => new RegExp(`^${e}$`, 'i')) } });
        }

        // Fallback: search text in station name or category
        orConditions.push({ name: { $regex: queryText, $options: 'i' } });
        orConditions.push({ category: { $regex: queryText, $options: 'i' } });

        const matchingStations = await station.find({ $or: orConditions }).sort({ name: 1 });
        res.json(matchingStations);
    } catch (err) {
        console.error("Semantic search failed:", err.message);
        res.status(500).json({ message: "Semantic search failed", error: err.message });
    }
};