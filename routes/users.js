const JWT = require("jsonwebtoken");
const router = require("express-promise-router")();
const User = require("../models/user");
const jwtsecret = require("../config/keys").JWTsecret;
const passport = require("passport");
const passportConf = require("../config/passport");

const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });
const passportGoogle = passport.authenticate("googleToken", { session: false });

signToken = user => {
  return JWT.sign(
    {
      iss: "exampleissue",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day
    },
    jwtsecret
  );
};

const { validateBody, schemas } = require("../helpers/routeHelpers");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ "local.email": email });
  if (foundUser) {
    return res.status(403).send({ error: "Email is already in use" });
  }

  const newUser = new User({
    method: "local",
    local: {
      email: email,
      password: password
    }
  });
  await newUser.save();

  // Generate the token
  const token = signToken(newUser);

  // Respond with token
  res.status(200).json({ token });
});

router.post("/signin", passportSignIn, async (req, res) => {
  // Generate the token
  const token = signToken(req.user);
  res.status(200).json({ token });
  console.log("Successfull login");
});

router.get("/secret", passportJWT, async (req, res) => {
  console.log("I managed to get here!");
  res.json({ secret: "resource" });
});

router.post("/oauth/google", passportGoogle, async (req, res) => {
  // Generate token
  console.log("req.user", req.user);

  const token = signToken(req.user);
  res.status(200).json({ token });
});

module.exports = router;
