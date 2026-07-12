
import express from 'express';
import axios from 'axios';
import http from 'http';
import https from 'https';
import url from 'url';

const proxyRouter = express.Router();

export const getStreamMetadata = (streamUrl) => {
    return new Promise((resolve) => {
        let isResolved = false;
        
        const safeResolve = (data) => {
            if (!isResolved) {
                isResolved = true;
                clearTimeout(hardTimeout);
                resolve(data);
            }
        };

        const hardTimeout = setTimeout(() => {
            try {
                if (req) req.destroy();
            } catch {}
            safeResolve({ title: null });
        }, 5000); // 5 seconds hard limit

        let req;
        try {
            const parsed = url.parse(streamUrl);
            const options = {
                hostname: parsed.hostname,
                port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
                path: parsed.path,
                method: 'GET',
                headers: {
                    'Icy-MetaData': '1',
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 3000
            };

            const reqLib = parsed.protocol === 'https:' ? https : http;

            req = reqLib.request(options, (res) => {
                const metaint = parseInt(res.headers['icy-metaint'], 10);
                if (isNaN(metaint)) {
                    safeResolve({ title: null });
                    res.destroy();
                    return;
                }

                let byteCount = 0;
                let metadataLength = 0;
                let metadataBuffer = Buffer.alloc(0);
                let inMetadata = false;

                res.on('data', (chunk) => {
                    let offset = 0;

                    while (offset < chunk.length) {
                        if (!inMetadata) {
                            const bytesUntilMeta = metaint - byteCount;
                            const bytesAvailable = chunk.length - offset;

                            if (bytesAvailable < bytesUntilMeta) {
                                byteCount += bytesAvailable;
                                offset = chunk.length;
                            } else {
                                offset += bytesUntilMeta;
                                byteCount = 0;
                                if (offset < chunk.length) {
                                    metadataLength = chunk[offset] * 16;
                                    offset += 1;
                                    if (metadataLength > 0) {
                                        inMetadata = true;
                                        metadataBuffer = Buffer.alloc(0);
                                    }
                                }
                            }
                        } else {
                            const bytesNeeded = metadataLength - metadataBuffer.length;
                            const bytesAvailable = chunk.length - offset;
                            const bytesToCopy = Math.min(bytesNeeded, bytesAvailable);

                            metadataBuffer = Buffer.concat([
                                metadataBuffer,
                                chunk.slice(offset, offset + bytesToCopy)
                            ]);
                            offset += bytesToCopy;

                            if (metadataBuffer.length === metadataLength) {
                                inMetadata = false;
                                const metaString = metadataBuffer.toString('utf-8');
                                const match = metaString.match(/StreamTitle='([^']*)'/);
                                const title = match ? match[1] : null;
                                safeResolve({ title });
                                res.destroy();
                                return;
                            }
                        }
                    }
                });

                res.on('end', () => {
                    safeResolve({ title: null });
                });

                res.on('error', () => {
                    safeResolve({ title: null });
                });
            });

            req.on('error', () => {
                safeResolve({ title: null });
            });

            req.on('timeout', () => {
                req.destroy();
                safeResolve({ title: null });
            });

            req.end();
        } catch {
            safeResolve({ title: null });
        }
    });
};

// Metadata parsing endpoint
proxyRouter.get('/metadata', async (req, res) => {
    try {
        const streamUrl = req.query.url;
        if (!streamUrl) {
            return res.status(400).json({ error: "url query parameter is required" });
        }
        const data = await getStreamMetadata(streamUrl);
        res.json(data);
    } catch (error) {
        console.error("Metadata parsing error:", error.message);
        res.status(500).json({ error: "Failed to parse metadata", details: error.message });
    }
});

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

// --- 7. E FM ---
proxyRouter.get('/efm', async (req, res) => {
    try {
        const url = "http://207.148.74.192:7860/stream.mp3";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("E FM Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});

// --- 8. Ran Fm ---
proxyRouter.get('/ranfm', async (req, res) => {
    try {
        const url = "http://207.148.74.192:7860/ran.mp3";
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });
        res.set('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error("Ran Fm Proxy Error:", error.message);
        res.status(500).send("Stream Error");
    }
});


export default proxyRouter;