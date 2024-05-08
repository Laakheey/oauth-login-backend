const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/linkedin",
  passport.authenticate("linkedin", { state: "SOME STATE" }),
  function (req, res) {}
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/",
  })
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    return res.json(req.user);
  } else {
    res.json("login success");
  }
});

router.get("/logout", (req, res) => {
  req.logOut((error) => {
    if (error) return;

    res.redirect("/");
  });
});


router.get(
    "/google",
    passport.authenticate("google", { state: "SOME STATE" }),
    function (req, res) {}
);



module.exports = router;
