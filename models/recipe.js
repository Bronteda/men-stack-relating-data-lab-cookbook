const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructions: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", //A reference to the User model.
  },
  //An array of references to the Ingredient model.
  ingredients: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Ingredient",
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
