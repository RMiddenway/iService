//. GENERAL IMPORTS
const https = require("https");
const express = require("express");
const cors = require("cors");
const { RequestHeaderFieldsTooLarge } = require("http-errors");
const bodyParser = require("body-parser");

// AUTH IMPORTS
const passport = require("passport");
const bcrypt = require("bcrypt");
const hashPassword = require("./util/hashPassword");
const cookieSession = require("cookie-session");
require("./util/passport-setup");
// const auth = require("./auth.js");

// DATABASE IMPORTS
const mongoose = require("mongoose");
const validator = require("validator");
const Task = require("./models/Task");
const Image = require("./models/Image");
const Expert = require("./models/Expert");
const User = require("./models/User");

// GENERAL INSTANTIATION
const app = express();
app.use(express.urlencoded({ limit: "25mb", extended: true }));
// // app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.static("public"));

//AUTH INSTANTIATION
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({ name: "session", keys: ["key1", "key2"] }));
app.use(passport.initialize());
app.use(passport.session());

// CONSTANT INSTANTIATION
const localDB = "mongodb://localhost:27017/iServiceDB";
const remoteDB =
  "mongodb+srv://admin-roger:password2020@cluster0.knut4.mongodb.net/uninewsletterDB?retryWrites=true&w=majority";

// todo - access logged in expert id from context
const EXPERT_ID = "613a0e800cb73968bd650054";

// DATABASE CONNEECTION
mongoose.connect(localDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// AUTH ROUTES

app.post("/signup", async (req, res) => {
  const user = new User();
  user.country = req.body.country;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;
  // customer.confirmPassword = req.body.confirmPassword;
  user.addressFirst = req.body.addressFirst;
  user.addressSecond = req.body.addressSecond;
  user.city = req.body.city;
  user.region = req.body.region;
  user.postcode = req.body.postCode;
  user.phone = req.body.phone;

  console.log(user);

  let error = user.validateSync();
  console.log(error);
  let errorMessages = [];
  if (error) {
    for (const k in error.errors) {
      // Take only the error messages
      errorMessages.push(error.errors[k].message);
    }
  }
  // Schema validation can't compare two fields, so compare manually here
  // if (req.body.password !== req.body.confirmPassword) {
  //   errorMessages.push("Password and password confirm must match.");
  // }

  // If backend validation finds error, send error message
  if (errorMessages.length) {
    res.status(500).send(errorMessages);
    // If no validation error, add object to database
  } else {
    user.password = await hashPassword(user.password);
    // user.confirmPassword = "null";
    // const Customer = mongoose.model("Customer", customerSchema);
    User.insertMany([user], (err) => {
      if (err) {
        res.send(err);
      } else {
        // Mailchimp sign up
        mailChimpAdd(user.email, user.firstName, user.lastName);
        // Redirect to signin page
        res.send("/signin");
      }
    });
  }
});

app.post("/signin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec();
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      res.status(500).send(err.message, "\nTry again later.");
    } else if (result === true) {
      // Manually sign in and obtain cookie using passport
      req.login(user, function (err) {
        if (err) {
          res.status(500).send("Error getting user");
        }
        if (req.body.remember === "on") {
          // If user has selexted "remember me", store cookie for 2 weeks
          req.sessionOptions.maxAge = 60 * 60 * 24 * 14;
        }
        res.send("/");
      });
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get("/signout", (req, res) => {
  req.session = null;
  req.logout();
  res.status(200).send("/signin");
  // res.redirect("/signin");
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
  console.log(req.query);
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
