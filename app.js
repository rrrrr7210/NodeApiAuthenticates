const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  app = express(),
  mongoose = require("mongoose"),
  db = require("./config/keys").mongoURI;

mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true });

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/users", require("./routes/users"));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening at ${port}`);
