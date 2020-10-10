var express = require("express");
var app = express();

var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = 80;
const BASE_URL = "https://render-api.zepeto.io/v2/graphics/zepeto/booth/";

// MongoDB Configuration
var mongoose = require("mongoose");
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", function () {
  console.log("Connected to MongoDB server");
});

mongoose.connect("mongodb://localhost:27017/zepeto-gpd");

// Define model
var Competition = require("./models/competition");
var Log = require("./models/log");
var User = require("./models/user");
var router = require("./routes")(app, Competition, Log, User);

var server = app.listen(PORT, function () {
  console.log("Express server running on port " + PORT);
});
