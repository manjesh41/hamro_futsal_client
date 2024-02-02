// const mongoose = require("mongoose");

// const exchangeBookingSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   originalBooking: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Booking",
//     required: true,
//   },
//   exchangedBooking: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Booking",
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "accepted", "declined"],
//     default: "pending",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   statusUpdatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// exchangeBookingSchema.set("toJSON", {
//   transform: (document, returnedDocument) => {
//     returnedDocument.id = document._id.toString();
//     delete returnedDocument._id;
//     delete returnedDocument.__v;
//   },
// });

// module.exports = mongoose.model("ExchangeBooking", exchangeBookingSchema);
