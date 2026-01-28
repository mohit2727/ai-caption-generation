const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("Gemini API Key Loaded:", !!GEMINI_API_KEY); // Debug

app.post('/generate', async (req, res) => {
    const Rawprompt = req.body.prompt;
    const prompt = `You are an creative caption generator for social media posts and generate 3 caption based on : ${Rawprompt}.`;

    if (!Rawprompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        const captions = aiText
            .split(/\n|•|-/)
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

        res.json({ captions });
    } catch (error) {
        console.error('Gemini API error:', error.response?.data || error.message);

        res.status(error.response?.status || 500).json({
            error: error.response?.data?.error?.message || 'Unknown Gemini server error',
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

