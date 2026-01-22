import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  try {
    console.log("Request Body Keys:", Object.keys(req.body || {}));
    const { image } = req.body;
    if (!image) {
      return res
        .status(400)
        .send("Error: No image data found in the request body.");
    }
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).send("API Key is missing from .env file.");
    }

    // 1. Initialize the client (Note: it takes an object with apiKey)
    const ai = new GoogleGenAI({ apiKey });

    // 2. Clean the image data
    const cleanImage = image.includes(",") ? image.split(",")[1] : image;

    // 3. Use the new .models.generateContent syntax (No getGenerativeModel needed)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // or "gemini-1.5-flash"
      contents: [
        {
          role: "user",
          parts: [
            {
              text: 'Analyze this meal. Return ONLY JSON: { "protein": number, "carb": number, "fat": number, "composition": "string" }',
            },
            { inlineData: { data: cleanImage, mimeType: "image/jpeg" } },
          ],
        },
      ],
    });
    console.log(response);
    const rawText = response.text;

    // This regex finds everything between the first '{' and the last '}'
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : rawText;

    // 4. In the new SDK, text is a direct property of the response
    console.log("Cleaned JSON:", cleanJson);
    res.status(200).send(cleanJson);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).send("SDK Error: " + error.message);
  }
}
