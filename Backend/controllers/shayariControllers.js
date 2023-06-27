const { Configuration, OpenAIApi } = require("openai");
const { shayariModel } = require("../models/shayariModels");

require("dotenv").config();

// Set up OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const shayariPostController = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Check if data already exists in the database
    const dataExist = await shayariModel.aggregate([
      {
        $match: {
          keyword: prompt,
        },
      },
    ]);

    if (dataExist.length > 0) {
      // Return existing data if it exists
      return res.status(200).json(dataExist[0]);
    }

    const systemMessage = `Act as an Expert Shayari Generator. The user will provide you a keyword as input, and you have to generate shayari around that in Hindi.`;

    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: `the keyword for shayari is ${prompt}` },
    ];

    if (!prompt) {
      // Prompt validation failed
      throw new Error("No prompt was provided");
    }

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const data = gptResponse.data.choices[0].message;

    // Save the generated data to the database
    const addDataInDb = new shayariModel({
      keyword: prompt,
      content: data.content,
    });
    await addDataInDb.save();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while generating Shayari" });
  }
};

module.exports = { shayariPostController };