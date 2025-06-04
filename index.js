require('dotenv').config();

const OpenAI = require("openai");
const client = new OpenAI();

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

async function get_reply(data,tone,context){
    const response = await client.responses.create({
        model: "gpt-4.1",
        input: "give me a reply for the tweet give below : " +data+ " in a " +tone+" tone. With the context "+ context
    });

    return response;
};

app.use(express.json())

app.post('/', async (req, res) => {


    const tweet = req.body.tweet;
    const tone = req.body.tone;
    const context = req.body.context;

    // 🔍 Log the incoming request
    console.log("Received POST /");
    console.log("Tweet:", tweet);
    console.log("Tone:", tone);
    console.log("Context:", context);

    try {
        const reply = await get_reply(tweet, tone, context);

        // 🧠 Log the raw reply
        console.log("Raw reply from OpenAI:", reply);

        const output_text = reply.output_text;
        console.log("Final output:", output_text);

        res.send(output_text);
    } catch (err) {
        console.error("❌ Error generating reply:", err);
        res.status(500).send("Failed to get reply from OpenAI.");
    }
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
