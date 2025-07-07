const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Ingredient = require("../models/ingredient.js");
const Recipe = require("../models/recipe.js");

//we don't need a index route they can add ingredients when adding a recipe
// router.get("/", async (req, res) => {
//   try {
//     const ingredients = await Ingredient.find({});
//     res.render("ingredients/index.ejs", { ingredients });
//   } catch (e) {
//     console.error("Cannot find ingredients", e);
//     res.status(500).send("Error Loading form");
//   }
// });

router.get("/new", (req, res) => {
  res.render("ingredients/new.ejs");
});

router.post("/", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const recipeId = req.body.recipeId;

    if (!name) {
      return res.redirect(req.get("Referer"));
    }

    console.log("Ingredient name:", name);

    // Try to find the ingredient
    let ingredient = await Ingredient.findOne({ name });

    // If not found, create it and assign the result to 'ingredient'
    if (!ingredient) {
      ingredient = await Ingredient.create({ name });
    }

    console.log("Ingredient document:", ingredient);

    // If a recipe ID was passed, add the ingredient to the recipe
    if (recipeId) {
      await Recipe.findByIdAndUpdate(recipeId, {
        $addToSet: { ingredients: ingredient._id },
      });
    }

    res.redirect(req.get("Referer"));
  } catch (e) {
    console.error("Couldn't add ingredient:", e);
    res.status(500).send("Couldn't add ingredient");
  }
});

module.exports = router;
