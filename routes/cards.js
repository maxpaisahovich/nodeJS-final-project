const express = require("express");
const router = express.Router();

const {
  Card,
  validateCard,
  generateBusinessNumber,
} = require("../models/cards");

const authMW = require("../middleware/authMw");

router.get("/my-cards", authMW, async (req, res) => {
  if (!req.user.biz) return res.status(401).send("Access denied.");
  const cards = await Card.find({ user_id: req.user._id });
  res.send(cards);
});

router.put("/:id", authMW, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await Card.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body,
    { new: true }
  );

  if (!card) {
    res.status(404).send("The card with the given ID was not found");
    return;
  }

  res.send(card);
});

router.delete("/:id", authMW, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("The card with the given ID was not found");
    return;
  }

  res.send(card);
});

router.get("/:id", authMW, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("The card with the given ID was not found");
    return;
  }

  res.send(card);
});

router.post("/", authMW, async (req, res) => {
  // validate user input
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // validate system
  // process
  const card = await new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    bizNumber: await generateBusinessNumber(),
    user_id: req.user._id,
  }).save();

  // response
  res.send(card);
});

module.exports = router;
