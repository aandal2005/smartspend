const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function parseWithGemini(ocrText) {

  // Clean OCR text
  const cleanedText = ocrText
    .replace(/\n+/g, " ")
    .replace(/[^\w₹+:. ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const prompt = `
You are extracting UPI debit transactions from OCR text of a Google Pay history screen.

Rules:
- Ignore any transaction with "+₹" or "+ ₹" (money credited).
- Only extract transactions where money was debited.
- Each transaction must include:
  Merchant Name
  Amount (₹)
  Date

Return ONLY valid JSON.

Example output:
[
 {
   "description": "VASANDHADEVI M",
   "amount": 52,
   "category": "Transfer",
   "type": "debit",
   "date": "2026-01-23"
 }
]

OCR TEXT:
${cleanedText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  let text = response.candidates[0].content.parts[0].text;

  // Remove markdown if Gemini returns it
  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini JSON parse error:", text);
    return [];
  }
}

module.exports = parseWithGemini;