const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_VISION_KEY)
});

async function extractText(imagePath) {

  const [result] = await client.textDetection(imagePath);

  const text = result.textAnnotations[0]?.description || "";

  return text;
}

module.exports = extractText;