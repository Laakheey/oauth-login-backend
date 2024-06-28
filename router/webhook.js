const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payments = require("../storeData/mainDb");
const mongoose = require("mongoose");

const router = express.Router();

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  console.log('Webhook received');
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed. Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let sessionData;
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      console.log("🚀 ~ router.post ~ checkoutSessionCompleted:", checkoutSessionCompleted)
      sessionData = checkoutSessionCompleted;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  const data = new Payments({
    userId: new mongoose.Types.ObjectId('666ee91689a6f624d7f80cfd'),
    restaurantID: new mongoose.Types.ObjectId('66573f6211cd76caa8c567ef'),
    stripeId: sessionData.id
  });
  await data.save();

  response.send(sessionData);
});

module.exports = router;
