const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = path.join(__dirname, req.file.path);

    // Perform OCR using ChatGPT API
    axios.post('https://api.openai.com/v1/ocr', {
        file: fs.createReadStream(imagePath)
    }, {
        headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        const text = response.data.text;
        res.json({ text });
    })
    .catch(error => {
        console.error('Error during OCR processing:', error);
        res.status(500).json({ message: 'Error during OCR processing.' });
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
