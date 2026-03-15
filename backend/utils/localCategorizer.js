const axios = require("axios");

async function categorizeTransaction(description) {

  const prompt = `
Classify this transaction into one category:

Categories:
Groceries, Shopping, Food, Utilities, Transport, Transfer, Bills, Entertainment

Transaction: ${description}

Return only the category name.
`;

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "mistral",
    prompt: prompt,
    stream: false
  });

  return response.data.response.trim();
}

module.exports = categorizeTransaction;