import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    logoUrl: { type: String },
    streamUrl: { type: String, required: true },
    language: { 
        type: String, 
        required: true,
        enum: ['Sinhala', 'Tamil', 'English']
    },
});

export default mongoose.model('station', stationSchema);