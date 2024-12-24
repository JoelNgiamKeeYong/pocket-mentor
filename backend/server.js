const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS
const app = express();
const port = process.env.PORT || 5000; // use Heroku’s environment variable for the port or 5000

// Use CORS middleware
app.use(cors());
app.use(express.json());

const HF_API_KEY = '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'; // Get your API key from Hugging Face

// Endpoint to handle the user message
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Call Hugging Face API to get the model's response
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
            {
                inputs: userMessage,
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                },
            }
        );

        // Send back the response from the model
        res.json({
            message: response.data[0].generated_text,
        });
    } catch (error) {
        console.error('Error with Hugging Face API:', error);
        res.status(500).json({ error: 'Error with AI request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
