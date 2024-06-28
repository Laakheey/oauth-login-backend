const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.configDotenv();

require('./auth/passport-linkedin');
require('./auth/passport-google');
require('./auth/passport-facebook');

const session = require('express-session');
const app = express();

app.use(session({secret: 'hdfjshfvhsdf'}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.raw());

app.get('/', (req, res) => {
  res.send(`<center style="font-size:160%"> <p>This is Home Page </p>
  <p>User is not Logged In</p>
  <img style="cursor:pointer;"  onclick="window.location='/auth/linkedin'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/> <br/> <br/>
  <a href='/auth/google'>Login with google</a>
  <br/> <br/>
  <a href='/auth/facebook'>Login with facebook</a>
  </center>
  `);
});

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"));

app.use('/auth', require('./router/linkedin'));
app.use('/api', require('./router/webhook'));


app.get(
  "/api/redirect_uri",
  passport.authenticate("google", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/",
  })
);

const PORT = process.env.PORT || 7658;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
