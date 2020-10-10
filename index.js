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
const DATABASE = "";

var server = app.listen(PORT, function () {
  console.log("Express server running on port " + PORT);
});
