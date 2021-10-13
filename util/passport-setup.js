const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Customer = require("../models/Customer");

const localDB = "mongodb://localhost:27017/iServiceDB";
const remoteDB =
  "mongodb+srv://admin-roger:password2020@cluster0.knut4.mongodb.net/uninewsletterDB?retryWrites=true&w=majority";
// todo - change when switching between local and heroku
mongoose.connect(remoteDB, {
  useNewUrlParser: true,
});

// todo - change when switching between local and heroku
const DOMAIN = "https://iservice62d.herokuapp.com";
// const DOMAIN = "http://localhost:8000";
passport.serializeUser(function (user, done) {
  console.log("serialize", user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "304926904443-4altq1dv50t5hciuvstp3hlv1lm0d6fk.apps.googleusercontent.com",
      clientSecret: "wFi8RqIvwftNepzrMzU9_lsD",
      callbackURL: `${DOMAIN}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      await Customer.findOne({ _id: profile.id }, (err, customer) => {
        if (customer) {
          return done(err, customer);
        } else {
          let customer = new Customer();
          customer._id = profile.id;
          customer.firstName = profile.name.givenName;
          customer.lastName = profile.name.familyName;
          customer.email = profile.email;
          Customer.insertMany([customer], (err) => {
            if (err) {
              console.log("err", err);
            } else {
              console.log("NEW CUSTOMER", customer);
              return done(err, customer);
            }
          });
        }
      });
    }
  )
);
