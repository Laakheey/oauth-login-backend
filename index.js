const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

require('./auth/passport-linkedin');
require('./auth/passport-google');
require('./auth/passport-facebook');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'hgsdfhagdgsagvgd',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(express.json({ type: 'application/json' }));

app.get('/', (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  res.send(`
    <center style="font-size:160%"> 
      <p>This is Home Page</p>
      <p>User is ${isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
      <img style="cursor:pointer;" onclick="window.location='/auth/linkedin'" src="http://www.bkpandey.com/wp-content/uploads/2017/09/linkedinlogin.png"/> 
      <br/> <br/>
      <a href='/auth/google'>Login with Google</a>
      <br/> <br/>
      <a href='/auth/facebook'>Login with Facebook</a>
    </center>
  `);
});

app.use('/auth', require('./router/linkedin'));

app.use('/api/webhook', require('./router/webhook'));

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
