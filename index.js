const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1327675281535664188/dz4XkrIcMZkz5-RwyXAawg1dz4sYGkDtiMGWfAuYzWbsFvaUPPmDE8EYCyRhFi-2Kdv_'; // Replace with your webhook URL

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to handle file uploads
app.post('/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  const IMAGE_URL = `http://localhost:3000/uploads/${req.file.filename}`; // Local URL for uploaded image

  // Send the uploaded image to Discord webhook
  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        content: 'New image uploaded!',
        embeds: [
          {
            title: 'Uploaded Image',
            image: { url: IMAGE_URL },
          },
        ],
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to send image to Discord');
    }

    res.send({ message: 'Image uploaded successfully!' });
  } catch (error) {
    res.status(500).send({ error: 'Error sending image to Discord' });
  }
});

// Serve uploaded files
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
