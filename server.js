// server.js - Your backend proxy server
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // You'll need to install: npm install express node-fetch cors

const app = express();

// Middleware
app.use(cors()); // Allows requests from your browser
app.use(express.json()); // Parses JSON request bodies

// Your secure proxy endpoint
app.post('/api/analyze-teacher', async (req, res) => {
    console.log('📡 Received request from browser bot...');
    
    try {
        const { userComment, criteria } = req.body;

        // IMPORTANT: Set your DeepSeek API Key as an environment variable (e.g., DEEPSEEK_API_KEY)
        // Never hard-code it here if sharing or deploying publicly.
        const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; 

        if (!DEEPSEEK_API_KEY) {
            console.error('❌ Server Error: DEEPSEEK_API_KEY environment variable is not set.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // Construct the prompt for DeepSeek
        const systemPrompt = `You are an assistant that rates university teachers. Based on this student comment: "${userComment}", rate each of the ${criteria.length} criteria from 1-5 (5=Excellent, 1=Poor). Return ONLY a valid JSON array of numbers, like [5,4,3,...].`;

        console.log(`🤖 Forwarding request to DeepSeek API for ${criteria.length} criteria...`);

        // Forward the request to DeepSeek
        const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You output only valid JSON arrays. No explanations.' },
                    { role: 'user', content: systemPrompt }
                ],
                temperature: 0.1,
                max_tokens: 1000,
            })
        });

        if (!deepseekResponse.ok) {
            const errorText = await deepseekResponse.text();
            console.error(`❌ DeepSeek API responded with error: ${deepseekResponse.status}`, errorText);
            throw new Error(`API error: ${deepseekResponse.status}`);
        }

        const data = await deepseekResponse.json();
        const aiResponse = data.choices[0].message.content.trim();

        // Parse and return the ratings
        let ratings;
        try {
            const jsonMatch = aiResponse.match(/\[[\d,\s]+\]/);
            ratings = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('❌ Failed to parse AI response as JSON:', aiResponse);
            throw new Error('AI returned an invalid format.');
        }

        console.log(`✅ Successfully parsed ${ratings.length} ratings from AI.`);
        res.json({ ratings });

    } catch (error) {
        console.error('❌ Proxy server error:', error);
        res.status(500).json({ 
            error: 'Analysis failed.', 
            details: error.message 
        });
    }
});

// Optional: A simple test endpoint
app.get('/', (req, res) => {
    res.send('🤖 Faculty Evaluation Proxy Server is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Proxy server listening on port ${PORT}`));
