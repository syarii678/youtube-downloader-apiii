const express = require('express');
const ytdl = require('node-yt-dl');
const cors = require('cors');

const app = express();
// Mengizinkan API diakses dari website lain
app.use(cors());

/**
 * Middleware untuk validasi API Key.
 * Ini adalah lapisan keamanan agar API Anda tidak digunakan sembarang orang.
 */
const checkApiKey = (req, res, next) => {
  const apiKey = req.query.apikey;
  // Ambil API Key yang valid dari Environment Variable di Vercel
  const validApiKey = process.env.API_KEY;

  // Cek jika admin belum mengatur API_KEY di Vercel
  if (!validApiKey) {
    return res.status(500).json({ 
      status: false, 
      message: 'Server configuration error: API Key not set by the administrator.' 
    });
  }
  // Cek jika pengguna tidak menyertakan API Key atau API Key-nya salah
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ 
      status: false, 
      message: 'Unauthorized: Invalid or missing API Key' 
    });
  }
  // Lanjutkan jika API Key valid
  next();
};

// Endpoint utama untuk mengecek apakah API berjalan
app.get('/api', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'YT Downloader API (node-yt-dl) is running on Vercel!',
  });
});

// Endpoint untuk mendapatkan link download Video (MP4)
app.get('/api/ytmp4', checkApiKey, async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ status: false, message: 'Parameter "url" is required and must be a valid YouTube URL.' });
  }

  try {
    const formats = await ytdl.getFormats(videoUrl);
    // Cari format video MP4 dengan kualitas terbaik yang memiliki video dan audio
    const videoFormat = 
        formats.find(f => f.qualityLabel && f.qualityLabel.includes('1080p') && f.container === 'mp4' && f.hasAudio) ||
        formats.find(f => f.qualityLabel && f.qualityLabel.includes('720p') && f.container === 'mp4' && f.hasAudio) ||
        formats.find(f => f.hasVideo && f.hasAudio); // Fallback untuk format lain jika 1080p/720p tidak ada

    if (!videoFormat) {
      return res.status(404).json({ status: false, message: 'No suitable video format with audio found.' });
    }
    // Arahkan pengguna langsung ke link download
    res.redirect(302, videoFormat.url);

  } catch (error) {
    console.error('Error fetching MP4 link:', error);
    res.status(500).json({ status: false, message: 'Failed to get video download link.', error: error.message });
  }
});

// Endpoint untuk mendapatkan link download Audio (kualitas terbaik)
app.get('/api/ytmp3', checkApiKey, async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ status: false, message: 'Parameter "url" is required and must be a valid YouTube URL.' });
  }
  try {
    const formats = await ytdl.getFormats(videoUrl);
    // Filter hanya format audio, lalu urutkan berdasarkan bitrate tertinggi
    const audioFormat = formats
      .filter(f => f.hasAudio && !f.hasVideo)
      .sort((a, b) => b.audioBitrate - a.audioBitrate)[0]; // Ambil yang pertama (bitrate tertinggi)

    if (!audioFormat) {
      return res.status(404).json({ status: false, message: 'No suitable audio-only format found.' });
    }
     // Arahkan pengguna langsung ke link download
    res.redirect(302, audioFormat.url);

  } catch (error) {
    console.error('Error fetching MP3 link:', error);
    res.status(500).json({ status: false, message: 'Failed to get audio download link.', error: error.message });
  }
});

// Export aplikasi Express agar Vercel dapat menjalankannya
module.exports = app;