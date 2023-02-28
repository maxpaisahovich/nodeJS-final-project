const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  bizDescription: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 1024,
  },
  bizAddress: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 400,
  },
  bizPhone: {
    type: String,
    required: true,
    minLength: 9,
    maxLength: 10,
  },
  bizImage: {
    type: String,
    required: true,
    minLength: 11,
    maxLength: 1024,
  },
  bizNumber: {
    type: Number,
    required: true,
    min: 100,
    max: 9_999_999_999_999,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema, "cards");

const validateCard = (card) => {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizPhone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    bizImage: Joi.string().min(11).max(1024).uri(),
  });

  return schema.validate(card);
};

const generateBusinessNumber = async () => {
  while (true) {
    let random = _.random(100, 9_999_999_999_999);
    let card = await Card.findOne({ bizNumber: random });

    if (!card) {
      return random;
    }
  }
};

module.exports = {
  Card,
  validateCard,
  generateBusinessNumber,
};
