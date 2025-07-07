const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
//controllers - Routes
const authController = require("./controllers/auth.js");
const foodsController = require("./controllers/foods.js");
const recipesController = require("./controllers/recipes.js");
const ingredientsController = require("./controllers/ingredients.js");
const userController = require("./controllers/users.js");

//middleware -before any routes that check for a valid user or require a user to be signed in to view a page.
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

//Port
const port = process.env.PORT ? process.env.PORT : "3000";
//db connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
// the part in front of the route in the url.
app.use(passUserToView);

//index page
app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("index.ejs", {
      user: req.session.user,
    });
  } else {
    res.render("index.ejs");
  }
});

//Now the routes below this can only be seen by signed in users
app.use("/auth", authController);
app.use(isSignedIn); //This means all the routes after isSignedIn require a signed-in user.
app.use("/users/:userId/foods", foodsController);
app.use("/recipes", recipesController);
app.use("/ingredients", ingredientsController);
app.use("/users", userController);

//listening
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
