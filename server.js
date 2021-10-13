const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");

app.use(express.urlencoded({ limit: "25mb", extended: true }));
// // app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.static("public"));

const hashPassword = require("./util/hashPassword");
const bcrypt = require("bcrypt");

// todo - access logged in expert id from context
const EXPERT_ID = "613a0e800cb73968bd650054";

const mongoose = require("mongoose");
const Task = require("./models/Task");
const Image = require("./models/Image");
const Expert = require("./models/Expert");

const localDB = "mongodb://localhost:27017/iServiceDB";
const remoteDB =
  "mongodb+srv://admin-roger:password2020@cluster0.knut4.mongodb.net/uninewsletterDB?retryWrites=true&w=majority";

mongoose.connect(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/task", (req, res) => {
  const task = req.body;
  Task.insertMany([task], (err) => {
    if (err) {
      res.send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Uploads base64 encoded image to Image collection and returns id
app.post("/upload", (req, res) => {
  const image = req.body;
  Image.insertMany([image], (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(data[0]._id);
    }
  });
});

app.get("/task", (req, res) => {
  // Combine query parameters from request
  let findParams = {};
  if (req.query.keywords) {
    findParams = {
      ...findParams,
      $text: { $search: req.query.keywords },
    };
  }
  if (req.query.taskDate !== undefined && req.query.taskDate !== "") {
    findParams = { ...findParams, taskDate: new Date(req.query.taskDate) };
  }
  if (req.query.suburb) {
    findParams = {
      ...findParams,
      suburb: { $regex: req.query.suburb, $options: "i" },
    };
  }
  // take task if user id is not in hiddenTasks
  findParams = { ...findParams, hiddenBy: { $ne: EXPERT_ID } };
  console.log(findParams);
  Task.find(findParams, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      // console.log(data);
      res.status(200).send(data);
    }
  });
});

// Adds current expert id to hiddenBy field in Task
// NB: expert id will be stored in app context on login, EXPERT_ID variable for scaffolding only
// todo - add login and store current user id
app.post("/hidetask", (req, res) => {
  const taskId = req.body.taskId;
  Task.findOneAndUpdate(
    { _id: taskId },
    { $push: { hiddenBy: EXPERT_ID } },
    (err, result) => {
      if (err) {
        // console.log("HIDE TASK ERROR: ", err);
        res.send(err);
      } else {
        // console.log("TASK HIDDEN");
        res.sendStatus(200);
      }
    }
  );
});

// Retrieve image from Images collection
app.get("/getimage", (req, res) => {
  const imageId = req.query.imageId;
  Image.findOne({ _id: imageId }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result).status(200);
    }
  });
});

app
  .route("/experts")
  // Get all expert documents from collection
  .get(async function (req, res) {
    const all = await Expert.find({});
    res.send(all);
  })
  // Create a new expert document
  .post(async function (req, res) {
    const expert = new Expert();
    expert.firstName = req.body.firstName;
    expert.lastName = req.body.lastName;
    expert.email = req.body.email;
    expert.password = await hashPassword.hashPassword(req.body.password);
    expert.addressFirst = req.body.addressFirst;
    expert.city = req.body.city;
    expert.region = req.body.region;
    expert.postcode = req.body.postcode;
    expert.phone = req.body.phone;
    Expert.insertMany([expert], (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  })
  // Delete all expert documents from collection
  .delete(function (req, res) {
    Expert.deleteMany({}, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  });
// Get expert document by id
app
  .route("/experts/:id")
  .get(async function (req, res) {
    // const expert;
    Expert.findOne({ _id: req.params.id }, (err, expert) => {
      if (err) {
        res.status(500).send(err);
      } else if (!expert) {
        res.status(404).send("Expert not found");
      } else res.send(expert);
    });
  })
  // Replace entire expert document
  .put(async function (req, res) {
    req.body.password = await hashPassword.hashPassword(req.body.password);
    Expert.updateOne({ _id: req.params.id }, { ...req.body }, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  })
  // Update only given fields of expert document
  .patch(async function (req, res) {
    if (req.body.password) {
      req.body.password = await hashPassword.hashPassword(req.body.password);
    }

    Expert.updateOne({ _id: req.params.id }, { ...req.body }, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  })
  // Delete expert document
  .delete(function (req, res) {
    Expert.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5100;
}
// todo - pass port number to fetch calls in ImageUpload and TaskForm when hosting in heroku
app.listen(port, (req, res) => {
  console.log("SERVER UP");
});
