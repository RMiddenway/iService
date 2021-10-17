//. GENERAL IMPORTS
const path = require("path");
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
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "304926904443-4altq1dv50t5hciuvstp3hlv1lm0d6fk.apps.googleusercontent.com"
);
// const auth = require("./auth.js");

// DATABASE IMPORTS
const mongoose = require("mongoose");
const validator = require("validator");
const Task = require("./models/Task");
const Image = require("./models/Image");
const Expert = require("./models/Expert");
const User = require("./models/User");

// AUX IMPORTS
const mailChimp = require("./util/mailChimp");
const stripe = require("stripe")(
  "sk_test_51JZxHLITf9d2JqkrXNdA6QPqCV7I6N8d9efou3cv7hUbJ81FubYQ7wTVQxuB3qMw2QJ3v0B6zuEwMJvlXDIov6rt00qQPLwR9t"
);

// GENERAL INSTANTIATION
const app = express();
app.use(express.urlencoded({ limit: "25mb", extended: true }));

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
// const YOUR_DOMAIN = "http://localhost:5100"; // todo - change when switching between local and heroku
const YOUR_DOMAIN = "https://iservice313.herokuapp.com/";

// DATABASE CONNEECTION
mongoose.connect(remoteDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// AUTH ROUTES
app.post("/api/v1/auth/google", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();

  const nameArray = name.split(" ");
  const firstName = nameArray[0];
  const lastName = nameArray.length - 1;
  const user = await User.findOneAndUpdate(
    { email: email },
    { firstName: firstName, lastName: lastName },
    { new: true, upsert: true }
  );
  req.session.userId = user.id;

  res.status(201).send({ _id: user._id, userType: user.userType });
});

app.get("/api/fail", (req, res) => {
  res.sendStatus(500);
});

app.post("/api/signup", async (req, res) => {
  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;

  let error = user.validateSync();
  console.log(error);
  let errorMessages = [];
  if (error) {
    for (const k in error.errors) {
      // Take only the error messages
      errorMessages.push(error.errors[k].message);
    }
  }

  // If backend validation finds error, send error message
  if (errorMessages.length) {
    res.status(500).send(errorMessages);
    // If no validation error, add object to database
  } else {
    user.password = await hashPassword.hashPassword(user.password);
    // user.confirmPassword = "null";
    // const Customer = mongoose.model("Customer", customerSchema);
    User.insertMany([user], (err) => {
      if (err) {
        res.send(err);
      } else {
        // Mailchimp sign up
        mailChimp.mailChimpAdd(user.email, user.firstName, user.lastName);
        // Redirect to signin page
        res.send("/signin");
      }
    });
  }
});

app.post("/api/signin", async (req, res) => {
  console.log("----");
  console.log(req.body);
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
        res.status(200).send({ _id: user._id, userType: user.userType });
      });
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get("/api/signout", (req, res) => {
  req.session = null;
  req.logout();
  res.status(200).send("/signin");
});

app.post("/api/task", (req, res) => {
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
app.post("/api/upload", (req, res) => {
  const image = req.body;
  Image.insertMany([image], (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(data[0]._id);
    }
  });
});

app.get("/api/task", (req, res) => {
  // todo - get current user id from session?
  console.log("[user]", req.user);
  const userId = req.query.userId;
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
  if (req.query.postedBy) {
    findParams = {
      ...findParams,
      userId: req.query.postedBy,
    };
  }
  if (req.query.expertId) {
    findParams = { ...findParams, expertId: req.query.expertId };
  }
  if (req.query.status) {
    findParams = { ...findParams, status: req.query.status };
  }
  // take task if user id is not in hiddenTasks
  findParams = { ...findParams, hiddenBy: { $ne: userId } };
  console.log("[find params]", findParams);
  Task.find(findParams)
    .sort({ taskDate: "asc" })
    .exec((err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
});

// Adds current expert id to hiddenBy field in Task

app.post("/api/hidetask", (req, res) => {
  const taskId = req.body.taskId;
  const userId = req.body.userId;
  Task.findOneAndUpdate(
    { _id: taskId },
    { $push: { hiddenBy: userId } },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});
app.put("/api/accepttask", (req, res) => {
  const taskId = req.body.taskId;
  const expertId = req.body.expertId;
  Task.findOneAndUpdate(
    { _id: taskId },
    { expertId: expertId, status: "accepted" },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});
app.put("/api/completetask", (req, res) => {
  console.log(req.body);
  const taskId = req.body.taskId;
  const finalCost = req.body.finalCost;
  Task.findOneAndUpdate(
    { _id: taskId },
    { finalCost: finalCost, status: "completed" },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Retrieve image from Images collection
app.get("/api/getimage", (req, res) => {
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
  .route("/api/users")
  // Get all user documents from collection
  .get(async function (req, res) {
    console.log(req.query);
    // Combine query parameters from request
    let findParams = {};
    if (req.query.expert === "true") {
      findParams = { ...findParams, userType: "expert" };
    }

    console.log("[find params]", findParams);
    User.find(findParams)
      .sort(req.query.sortby === "rating" ? { rating: "desc" } : {})
      .limit(JSON.parse(req.query.count))
      .exec((err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          console.log(data);
          res.status(200).send(data);
        }
      });
  })
  // Create a new expert document
  .post(async function (req, res) {
    console.log(req.body);
    const user = new User({ ...req.body });

    User.insertMany([user], (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  })
  // Delete all expert documents from collection
  .delete(function (req, res) {
    User.deleteMany({}, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  });
// Get expert document by id
app
  .route("/api/users/:id")
  .get(async function (req, res) {
    // const expert;
    User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(404).send("User not found");
      } else res.send(user);
    });
  })

  // Update only given fields of expert document
  .put(async function (req, res) {
    if (req.body.password) {
      req.body.password = await hashPassword.hashPassword(req.body.password);
    }

    User.updateOne({ _id: req.params.id }, { ...req.body }, (err) => {
      if (err) {
        console.log("[users patch]", req.body);
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  })
  // Delete expert document
  .delete(function (req, res) {
    User.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  });

// STRIPE
// STRIPE PAYMENT
app.post("/api/payment", (req, res) => {
  console.log("[PAYMENT REQUEST BODY]", req.body);
  const { cost, title, token } = req.body;
  const idempotencyKey = uuid();
  return stripe.customers
    .create({ email: token.email, source: token.id })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: cost * 100,
          currency: "aud",
          customer: customer.id,
          receipt_email: token.email,
          description: title,
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    let url = path.result(__dirname, "client", "build", "index.html");
    if (!url.startsWith("/app/")) url = url.substring(1);
    res.sendFile(url);
  });
}

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  port = 5100;
}
app.listen(PORT, (req, res) => {
  console.log("SERVER UP");
});
