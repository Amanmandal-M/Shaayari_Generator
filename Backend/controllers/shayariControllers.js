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

    if (!prompt) {
      // Prompt validation failed
      throw new Error("No prompt was provided");
    }

    // Check if data already exists in the database
    const dataExist = await shayariModel.findOne({ keyword: prompt });

    if (dataExist) {
      // Return existing data if it exists
      return res.status(200).json(dataExist);
    }

    const systemMessage = `Act as an Expert Shayari Generator. The user will provide you a keyword as input, and you have to generate shayari around that in Hindi and Keep in short`;

    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: `the keyword for shayari is ${prompt}` },
    ];

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const dataContent = gptResponse.data.choices[0].message.content;

    // Save the generated data to the database
    const addDataInDb = await shayariModel.create({
      keyword: prompt,
      content: dataContent,
    });

    res.status(200).json(addDataInDb);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while generating Shayari" });
  }
};

module.exports = { shayariPostController };