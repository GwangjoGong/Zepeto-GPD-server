var rand = require("random-key");

module.exports = function (app, Competition, Log, User) {
  // Competition API
  // Create a competition
  app.post("/api/create_comp", async function (req, res) {
    try {
      var comp = new Competition();
      comp.code = rand.generate(7);
      comp.name = req.body.name;
      comp.cover_image = req.body.cover_image;
      comp.capacity = req.body.capacity;
      comp.category = req.body.category;

      await comp.save();
    } catch (err) {
      console.log(err.message);
      return res.json({
        result: 0,
        message: err.message,
      });
    } finally {
      res.json({
        result: 1,
      });
    }
  });

  //Get ongoing competition list
  app.get("/api/comp_list", function (req, res) {
    Competition.find(
      {
        status: "ongoing",
      },
      {
        participants: 0,
      },
      (err, comps) => {
        if (err) {
          return res.json({
            result: 0,
            message: err.message,
          });
        }

        return res.json({
          result: 1,
          comps,
        });
      }
    );
  });

  // Get a competition of vote
  app.get("/api/competition/:code", async function (req, res) {
    var comp_code = req.params.code;
    var comp = await Competition.findOne(
      {
        code: comp_code,
      },
      { participants: 1 }
    );

    if (!comp)
      return res.json({ result: 0, message: "Competition Not Found." });

    return res.json({
      result: 1,
      comp,
    });
  });

  // Delete a competition
  app.delete("/api/delete_comp", function (req, res) {
    Competition.remove({ code: req.body.code }, function (err, output) {
      if (err) return res.json({ result: 0, messag: "database failure" });

      return res.json({
        result: 1,
      });
    });
  });

  // User API
  // Register User
  app.post("/api/user_register", function (req, res) {
    var user = new User();
    user.hashcode = req.body.hashcode;
    user.nickname = req.body.nickname;

    user.save(function (err) {
      if (err) {
        console.log(err.message);
        return res.json({ result: 0, message: err.message });
      }

      return res.json({ result: 1 });
    });
  });

  app.delete("/api/delete_user", function (req, res) {
    User.remove({ hashcode: req.body.hashcode }, function (err, output) {
      if (err) return res.json({ result: 0, messag: "database failure" });

      return res.json({
        result: 1,
      });
    });
  });

  // Log API
  // Create a log
  app.post("/api/create_log", async function (req, res) {
    var log = new Log();
    log.user_code = req.body.user_code;
    log.type = req.body.type;
    if (req.body.type === "voted") {
      log.votee_code = req.body.votee_code;
    }

    log.comp_code = req.body.comp_code;

    var targetComp = await Competition.findOne({
      code: req.body.comp_code,
    });

    if (!targetComp) {
      return res.json({
        result: 0,
        message: "Competition not found.",
      });
    }

    log.comp_name = targetComp.name;

    var now = new Date();
    now.setHours(now.getHours() + 1);

    log.end_time = now;

    await log.save();
    res.json({
      result: 1,
    });
  });

  // app.post("/api/archive_log", async function (req, res) {
  //   var log = await Log.findOne({
  //     _id: req.body.id,
  //   });

  //   if (!log)
  //     return res.json({
  //       result: 0,
  //       message: "Log not found.",
  //     });

  //   log.is_done = true;
  // });

  // Get user's log
  app.post("/api/user_logs", async function (req, res) {
    var logs = await Log.find({ user_code: req.body.user_code });
    return res.json({
      result: 1,
      logs,
    });
  });
};
