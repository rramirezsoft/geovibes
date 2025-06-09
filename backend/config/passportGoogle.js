const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/nosql/user.js');

async function generateUniqueNickname(baseNickname) {
  let nickname = baseNickname.toLowerCase().replace(/\s+/g, '');
  let exists = await User.findOne({ nickname });
  let suffix = 1;

  while (exists) {
    nickname = `${baseNickname}${suffix}`;
    exists = await User.findOne({ nickname });
    suffix++;
  }

  return nickname;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.emailVerified = true;
            await user.save();
          }
        } else {
          const baseNickname = profile.emails[0].value.split('@')[0];
          const nickname = await generateUniqueNickname(baseNickname);

          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            nickname,
            name: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            profilePicture: profile.photos?.[0]?.value || '',
            emailVerified: true,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
