const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/download', async (req, res) => {
    const { url } = req.body;
    try {
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(url, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while downloading the video' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
