const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minLength: 10,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

reviewSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = document._id.toString();
    delete returnedDocument._id;
  },
});

module.exports = mongoose.model("Review", reviewSchema);
