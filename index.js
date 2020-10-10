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

// Competition Updater
var cron = require("node-cron");

var archiveLog = async function () {
  console.log("Checking competitions...");
  console.time("Elapsed Time");

  var onGoingComps = await Competition.find({
    status: "ongoing",
  });

  var now = new Date();

  // Archive old competitions
  var archivableComps = await Competition.find({ status: "finished" });
  var oldComps = archivableComps.filter((comp) => {
    var date = new Date(comp.archive_time);
    return date >= now;
  });

  oldComps.forEach(async (comp) => {
    comp.status = "archived";
    comp.participants.forEach(p => {
      var user = await User.findOne({
        hashcode: p.user_code
      });
      var participanting_comps = user.participanting_comps;
      var compIndex = participanting_comps.findIndex(uc => uc === comp.code);
      participanting_comps = participanting_comps.splice(compIndex, 1);
      user.participanting_comps = participanting_comps;

      var hosting_comps = user.hosting_comps;
      compIndex = hosting_comps.findIndex(uc => uc === comp.code);
      hosting_comps = hosting_comps.splice(compIndex, 1);
      user.hosting_comps = hosting_comps;

      await user.save();
    })
    await comp.save();
  });

  
  // Finish competitions which passes the deadline
  var finishedComps = onGoingComps.filter((comp) => {
    var date = new Date(comp.end_time);
    return date >= now;
  });

  for (var comp of finishedComps) {
    // Make rank
    var rank = comp.participants.sort((a, b) => b.votes - a.votes);
    var winner = rank[0];

    comp.status = "finished";
    await comp.save();

    // Find related logs and record results
    var logs = await Log.find({ comp_code: comp.code });

    for (var log of logs) {
      if (log.type === "participated") {
        // Participated
        var participantindex = rank.findIndex(
          (user) => user.user_code === log.user_code
        );

        log.user_rank = participantindex + 1;
        log.user_votes = rank[participantindex].votes;
      } else {
        // Voted
        var voteeIndex = rank.findIndex(
          (user) => user.user_code === log.votee_code
        );
        log.votee_nickname = rank[voteeIndex].user_nickname;
        log.votee_img = rank[voteeIndex].user_img;
        log.votee_rank = voteeIndex + 1;
        log.votee_votes = rank[voteeIndex].votes;
      }

      log.winner_nickname = winner.user_nickname;
      log.winner_code = winner.user_code;
      log.winner_img = winner.user_img;
      log.winner_votes = winner.votes;
      log.is_done = true;

      await log.save();
    }
  }

  console.log("Competition status updated!");
  console.timeEnd("Elapsed Time");
};

cron.schedule("* * * * *", () => {
  archiveLog();
});

var server = app.listen(PORT, function () {
  console.log("Express server running on port " + PORT);
});
