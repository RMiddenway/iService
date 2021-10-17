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
// app.use(bodyParser.urlencoded({ extended: true }));
// const corsOptions = {
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
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
// todo - access logged in expert id from context
// const EXPERT_ID = "613a0e800cb73968bd650054";

// DATABASE CONNEECTION
mongoose.connect(remoteDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// AUTH ROUTES
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/fail",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

app.get("/api/fail", (req, res) => {
  res.sendStatus(500);
});

app.post("/api/signup", async (req, res) => {
  const user = new User();
  // user.country = req.body.country;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;
  // customer.confirmPassword = req.body.confirmPassword;
  // user.addressFirst = req.body.addressFirst;
  // user.addressSecond = req.body.addressSecond;
  // user.city = req.body.city;
  // user.region = req.body.region;
  // user.postcode = req.body.postCode;
  // user.phone = req.body.phone;

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
  // res.redirect("/signin");
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
// NB: expert id will be stored in app context on login, EXPERT_ID variable for scaffolding only
// todo - add login and store current user id
app.post("/api/hidetask", (req, res) => {
  const taskId = req.body.taskId;
  const userId = req.body.userId;
  Task.findOneAndUpdate(
    { _id: taskId },
    { $push: { hiddenBy: userId } },
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
app.put("/api/accepttask", (req, res) => {
  const taskId = req.body.taskId;
  const expertId = req.body.expertId;
  Task.findOneAndUpdate(
    { _id: taskId },
    { expertId: expertId, status: "accepted" },
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
app.put("/api/completetask", (req, res) => {
  console.log(req.body);
  const taskId = req.body.taskId;
  const finalCost = req.body.finalCost;
  Task.findOneAndUpdate(
    { _id: taskId },
    { finalCost: finalCost, status: "completed" },
    (err, result) => {
      if (err) {
        // console.log("HIDE TASK ERROR: ", err);
        res.send(err);
      } else {
        console.log("TASK UPDATED", result);
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
    // const all = await User.find(findParams);
    // res.send(all);
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

    // user.firstName = req.body.firstName;
    // user.lastName = req.body.lastName;
    // user.email = req.body.email;
    // user.password = await hashPassword.hashPassword(req.body.password);
    // user.addressFirst = req.body.addressFirst;
    // user.city = req.body.city;
    // user.region = req.body.region;
    // user.postcode = req.body.postcode;
    // user.phone = req.body.phone;

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
  // Replace entire expert document
  // .put(async function (req, res) {
  //   req.body.password = await hashPassword.hashPassword(req.body.password);
  //   User.updateOne({ _id: req.params.id }, { ...req.body }, (err) => {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       res.sendStatus(200);
  //     }
  //   });
  // })
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

app.post("/create-checkout-session", async (req, res) => {
  const prices = await stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ["data.product"],
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });
  res.redirect(303, session.url);
});
app.post("/create-portal-session", async (req, res) => {
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
  const returnUrl = YOUR_DOMAIN;
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });
  res.redirect(303, portalSession.url);
});
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const event = request.body;
    const endpointSecret = "whsec_12345";
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case "customer.subscription.created":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case "customer.subscription.updated":
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/payment-success.html");
});
app.get("/cancel", (req, res) => {
  res.sendFile(__dirname + "/payment-cancel.html");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.result(__dirname, "client", "build", "index.html"));
  });
}

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  port = 5100;
}
// todo - pass port number to fetch calls in ImageUpload and TaskForm when hosting in heroku
app.listen(PORT, (req, res) => {
  console.log("SERVER UP");
});
