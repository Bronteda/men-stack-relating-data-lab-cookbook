const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Ingredient = require("../models/ingredient.js");
const Recipe = require("../models/recipe.js");


router.get("/", async (req,res) => {
    const users = await User.find({});
    res.render("users/index.ejs", {users});
});

router.get("/:userId", async (req,res) =>{
    const userRecipes = await Recipe.find({owner:req.params.userId}).populate("ingredients");
    const user = await User.findById(req.params.userId);
    console.log(userRecipes);
    res.render("users/show.ejs", {recipes:userRecipes, user})
});

module.exports = router;