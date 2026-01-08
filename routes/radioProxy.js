
import express from 'express';
import axios from 'axios';

const proxyRouter = express.Router();

//---1. Rajarata Sewaya ---
proxyRouter.get('/rajarata', async (req, res) => {
    try {
        const url = "http://220.247.227.20:8000/rajaratastream"; 
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Rajrata Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 2. Kandurata Sewaya ---
proxyRouter.get('/kandurata', async (req, res) => {
    try {
        const url = "http://220.247.227.20:8000/kandystream";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Kandurata Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});


// --- 3. Radio Sri Lanka ---
proxyRouter.get('/radiosrilanka', async (req, res) => {
    try {
        const url = "http://220.247.227.20:8000/RSLstream";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Radio Sri Lanka Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 4. Ruhunu Sewaya ---
proxyRouter.get('/ruhunu', async (req, res) => {
    try {
        const url = "http://220.247.227.20:8000/ruhunustream";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Ruhunu Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 5. City Fm ---
proxyRouter.get('/cityfm', async (req, res) => {
    try {
        const url = "http://220.247.227.20:8000/citystream";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("City Fm Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 6. Swadeshiya Sewaya ---
proxyRouter.get('/swadeshiya', async (req, res) => {
    try {
        const url = "http://220.247.227.6:8000/Snsstream";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Swadeshiya Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 7. Welanda Sewaya ---
proxyRouter.get('/welanda', async (req, res) => {
    try {
        const url = "http://220.247.227.6:8000/Scomstream";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Welanda Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 6. Shree Fm ---
proxyRouter.get('/shreefm', async (req, res) => {
    try {
        const url = "http://207.148.74.192:7860/stream2.mp3";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Shree Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});


export default proxyRouter;