// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = require('stripe')('');
const express = require("express");
const Payments = require('../storeData/mainDb');
const router = express.Router();

const endpointSecret = "whsec_df8b1affad84574930077d48237fe077608fdaecc909e6eb3b73da28e2d81bbe";

router.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  let sessionData;
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      sessionData = checkoutSessionCompleted;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  const data = new Payments(sessionData);
  await data.save()

  response.send(sessionData);
});

module.exports = router;