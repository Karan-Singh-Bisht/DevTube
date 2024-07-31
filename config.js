require("dotenv").config();
const passport = require("passport");

let GoogleStrategy = require("passport-google-oauth20").Strategy;
const channelModel = require("./models/channelModel");
const { createUniqueHandler } = require("./utils");

//Configure the Google Strategy for use by passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let channel = await channelModel.findOne({
          email: profile.emails[0].value,
        });

        if (!channel) {
          const handle = await createUniqueHandler(
            profile.emails[0].value.split("@")[0]
          );
          channel = await channelModel.create({
            name: profile.displayName,
            handle: handle,
            email: profile.emails[0].value,
            logoUrl: profile.photos[0].value.split("=")[0],
          });
          //Return the channel through the callback
        }
        cb(null, channel);
      } catch (err) {
        cb(err);
      }
    }
  )
);

//Serialize the user to decide which data of the user object should be stored in the session
passport.serializeUser((channel, done) => {
  done(null, channel.id);
});

//Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const channel = await channelModel.findById(id);
    done(null, channel);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
