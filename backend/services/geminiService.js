import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCateringRecommendation = async (userMessage, packages) => {
  try {
    // 1. 深度整理数据：提炼每个商家的核心竞争力、位置、价格区间和接待能力
    const providerStats = {};
    
    packages.forEach(pkg => {
      const provider = pkg.providerId;
      const bName = provider?.businessName || 'Unknown Provider';
      
      // 智能提取位置信息
      let locationInfo = provider?.state || '';
      if (provider?.serviceLocations && provider.serviceLocations.length > 0) {
        locationInfo += ` (${provider.serviceLocations.join(', ')})`;
      }
      if (!locationInfo) locationInfo = provider?.address || 'Location not specified';

      if (!providerStats[bName]) {
        providerStats[bName] = { 
          location: locationInfo,
          packages: [],
          minPrice: pkg.price,
          maxPrice: pkg.price,
          minPaxCap: pkg.minPax || 1,
          maxPaxCap: pkg.maxPax || 1000
        };
      }
      
      // 更新价格和人数的极值
      if (pkg.price < providerStats[bName].minPrice) providerStats[bName].minPrice = pkg.price;
      if (pkg.price > providerStats[bName].maxPrice) providerStats[bName].maxPrice = pkg.price;
      if (pkg.minPax < providerStats[bName].minPaxCap) providerStats[bName].minPaxCap = pkg.minPax || 1;
      if (pkg.maxPax > providerStats[bName].maxPaxCap) providerStats[bName].maxPaxCap = pkg.maxPax || 1000;
      
      // 保存具体的套餐精简信息
      providerStats[bName].packages.push({
        name: pkg.name,
        price: pkg.price,
        paxRange: `${pkg.minPax || 1} - ${pkg.maxPax || 'Any'} pax`
      });
    });

    // 2. 将数据转化为 AI 易读的格式 (Prompt Context)
    const providerContext = Object.entries(providerStats)
      .map(([name, stat]) => {
        const pkgDetails = stat.packages.map(p => `  - ${p.name}: RM${p.price} (${p.paxRange})`).join('\n');
        return `Provider: **${name}**\nLocation: ${stat.location}\nPrice Range: RM${stat.minPrice} - RM${stat.maxPrice}\nCapacity: ${stat.minPaxCap} to ${stat.maxPaxCap} pax\nPackages Details:\n${pkgDetails}\n`;
      }).join('\n');

    const prompt = `
      You are CaterFlow AI, an intelligent and professional catering assistant for the CaterFlowCMS platform.
      
      Here is the complete real-time database of our Catering Providers and their exact packages:
      
      === DATABASE ===
      ${providerContext}
      ================
      
      User Message: "${userMessage}"
      
      CORE INSTRUCTIONS:
      1. Analyze the user's request carefully (extracting budget, location, headcount/pax).
      2. Match their needs strictly with the DATABASE provided above. Do NOT invent providers, locations, or packages.
      3. If recommending, list the best matching packages. Format the provider and package names in **bold**.
      4. State WHY you recommend them based on the data.
      5. If the user asks for a location or budget not in the database, politely apologize and list the closest alternatives we DO have.
      6. Keep the tone helpful, welcoming, and strictly in English. Use bullet points for readability if listing multiple items.
    `;

    // 使用你成功跑通的最新模型
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    
    return result.response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Based on your needs, I highly recommend checking out our verified catering providers below. They offer a great variety of packages that might perfectly fit your budget and event size!";
  }
};