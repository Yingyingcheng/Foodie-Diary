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
              text: `Analyze this meal photo. Return ONLY JSON:
{ "protein": number, "carb": number, "fat": number, "composition": "string" }
Rules for "composition":
- List the main food items, one per line, each prefixed with "- ".
- Max 10 items, each 3-6 words. Brief descriptors are fine
  (e.g. "- Udon soup with tofu & egg", "- Glazed teriyaki chicken").
- No full sentences. Never write phrases like "The meal consists of".
- Separate lines using the \\n escape inside the JSON string so the JSON stays valid.`,
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
