const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient");

//GET /recipes
router.get("/", async (req, res) => {
  const currentUserId = req.session.user._id;
  const userRecipes = await Recipe.find({ owner: currentUserId });
  res.render("recipes/index.ejs", { userRecipes });
});

//GET /recipes/new - new recipe
router.get("/new", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render("recipes/new.ejs", { ingredients });
  } catch (e) {
    console.error("Couldn't find Ingredients:", e);
    res.status(500).send("Error loading form");
  }
});

router.post("/", async (req, res) => {
  try {
    const recipeData = {
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: req.body.ingredients,
      owner: req.session.user._id,
    };
    await Recipe.create(recipeData);
    res.redirect("/recipes");
    // const newRecipe = new Recipe(req.body);
    // newRecipe.owner = req.session.user._id;
    // await newRecipe.save();
  } catch (e) {
    console.error("Couldn't add new recipe:", e);
  }
});

//GET /recipes/:recipeId - Show page
router.get("/:recipeId", async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId).populate(
      "ingredients",
    );
    //console.log(currentRecipe);
    res.render("recipes/show.ejs", { recipe: currentRecipe });

    //res.locals can be used if we want to make recipes data global in the ejs
    //res.locals.recipe = currentRecipe
    //res.render("recipes/show.ejs")
  } catch (e) {
    console.error("Cannot get recipe", e);
    res.status(500).send("Recipe cannot Load");
  }
});

//Delete /recipes/:recipeId -Delete
router.delete("/:recipeId", async (req, res) => {
  try {
    const currentRecipe = await Recipe.findByIdAndDelete(req.params.recipeId);
    //using deleteOne - both ways work
    //const result = await Recipe.deleteOne({ _id: req.params.recipeId });
    res.redirect("/recipes");
  } catch (e) {
    console.error("Cound't delete recipe", e);
    res.status(500).send("Recipe couldn't be deleted");
  }
});

//GET /recipes/:recipeId/edit
router.get("/:recipeId/edit", async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId).populate(
      "ingredients",
    );
    res.render("recipes/edit.ejs", { recipe: currentRecipe });
  } catch (e) {
    console.error("Cound't reach edit page", e);
    res.status(500).send("Cannot reach the edit page");
  }
});

//POST to /recipes/:recipeId
router.put("/:recipeId", async (req, res) => {
  try {
    const updatedRecipeData = {
      name: req.body.name,
      instructions: req.body.instructions,
      //isArray I learnt about
      ingredients: Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : [req.body.ingredients], // handles single checkbox case
      owner: req.session.user._id,
    };

    await Recipe.findByIdAndUpdate(req.params.recipeId, updatedRecipeData);
    res.redirect(`/recipes/${req.params.recipeId}`);
  } catch (e) {
    console.error("Couldn't update recipe:", e);
    res.redirect("/recipes");
  }
});

module.exports = router;
