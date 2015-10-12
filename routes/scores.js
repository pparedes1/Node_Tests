var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('GET scores');
  // Get the database object we attached to the request
  var db = req.db;
  // Get the collection
  var collection = db.get('scores');
  // Find all entries, sort by time (ascending)
  collection.find({}, { sort: { time: 1 } }, function (err, docs) {
    if (err) {
        // Handle error
        console.error('Failed to get scores', err);
        res.status(500).send('Failed to get scores');
    } else {
        // Respond with the JSON object
        res.json(docs);
    }
  });
});

// GET a number of top scores
// (the /top route without a number won't work unless we add it)
router.get("/top/:number", function(req, res) {
    console.log("GET top scores");
    // Read the request parameter
    var num = req.params.number;
    var db = req.db;
    var collection = db.get("scores");
    // Get all scores, but limit the number of results
    collection.find({}, { limit: num, sort: { time : 1 } }, function(err, docs) {
        if (err) {
            console.error("Failed to get scores", err);
            res.status(500).send("Failed to get scores");
        } else {
            res.json(docs);
        }
    });
});


// POST a score
router.post("/", function(req, res) {
    console.log("POST score");
    var name = req.body.name;
    var time = Number(req.body.time);
    if (!(name && time)) {
        console.error("Data formatting error");
        res.status(400).send("Data formatting error");
        return;
    }
    var db = req.db;
    var collection = db.get("scores");
    collection.insert({
        "name": name,
        "time": time
    }, function(err, doc) {
        if (err) {
            console.error("DB write failed", err);
            res.status(500).send("DB write failed");
        } else {
            // Return the added score
            res.json(doc);
        }
    });
});

module.exports = router;
