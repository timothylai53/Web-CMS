import express from 'express';
import { generateCateringRecommendation } from '../services/geminiService.js';
import { Package } from '../models/Menu.js'; // 确保路径正确

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. 抓取最全的数据库数据 (新增了 state, address, serviceLocations 等关键字段)
    const packages = await Package.find()
      .populate('providerId', 'businessName state address serviceLocations phone')
      .lean();
    
    console.log(`[AI Chat] Processing request, found ${packages.length} packages in database.`);

    // 2. 呼叫 AI
    const aiReply = await generateCateringRecommendation(message, packages);

    // 3. 防御性容错机制
    if (!aiReply || aiReply.trim() === "") {
      console.warn("[AI Chat] AI returned an empty string.");
      return res.json({ 
        reply: "I am currently unable to generate a recommendation. Please browse the packages below or contact the providers directly for assistance." 
      });
    }

    console.log("[AI Chat] Reply generated successfully.");
    res.json({ reply: aiReply });

  } catch (error) {
    console.error("❌ AI Route Error:", error);
    res.status(200).json({ 
      reply: "The AI assistant is temporarily offline. Please browse the recommended packages below!" 
    });
  }
});

export default router;