const autoDetectCategory = (description) => {
  if (!description) return "Others";

  const text = description.toLowerCase();

  const categoryMap = {
    Food: ["swiggy", "zomato", "restaurant", "dinner", "lunch", "cafe"],
    Shopping: ["amazon", "flipkart", "myntra", "purchase", "shopping"],
    Travel: ["uber", "ola", "bus", "train", "flight", "taxi"],
    Entertainment: ["netflix", "movie", "spotify", "hotstar"],
    Bills: ["electricity", "water", "rent", "internet", "mobile"],
  };

  for (let category in categoryMap) {
    for (let keyword of categoryMap[category]) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  return "Others";
};

module.exports = autoDetectCategory;
