const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./google-vision-key.json"
});

async function extractText(imagePath) {

  const [result] = await client.textDetection(imagePath);

  const text = result.textAnnotations[0]?.description || "";

  return text;
}

module.exports = extractText;