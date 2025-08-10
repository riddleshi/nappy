const DreamJournal = require('../models/DreamJournal');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.addDream = async (req, res) => {
  const { date, dream_text } = req.body;
  const username = req.user?.name;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await DreamJournal.addDream({ date, dream_text, username });
    res.status(201).json({ message: 'Dream saved!' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving dream' });
  }
};

exports.getDreams = async (req, res) => {
  const username = req.user?.name;
  if (!username) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const dreams = await DreamJournal.getDreamsByUsername(username);
    res.json({ dreams });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dreams' });
  }
};

exports.interpretDream = async (req, res) => {
  const { dream_text, id } = req.body;
  if (!dream_text) return res.status(400).json({ message: 'No dream text provided' });

  try {
    const prompt = `Interpret this dream within 5 sentences:\n"${dream_text}"`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const ai_response = response.text;

    if (id) {
      await DreamJournal.updateAIResponse(id, ai_response);
    }

    res.json({ ai_response });
  } catch (err) {
    res.status(500).json({ message: 'AI interpretation failed' });
  }
};