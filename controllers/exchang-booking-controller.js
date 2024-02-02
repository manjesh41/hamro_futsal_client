// const ExchangeBooking = require("../models/exchange-booking");

// // Create a new exchange booking
// const createExchangeBooking = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     const exchangeBookingData = {
//       user: userId,
//       originalBooking: req.body.originalBooking,
//       exchangedBooking: req.body.exchangedBooking,
//     };

//     const exchangeBooking = await ExchangeBooking.create(exchangeBookingData);
//     res.status(201).json(exchangeBooking);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all exchange bookings
// const getAllExchangeBookings = (req, res, next) => {
//   ExchangeBooking.find()
//     .populate("user", "username")
//     .populate("originalBooking")
//     .populate("exchangedBooking")
//     .then((exchangeBookings) => {
//       res.json(exchangeBookings);
//     })
//     .catch(next);
// };

// // Get a specific exchange booking by ID
// const getExchangeBookingById = (req, res, next) => {
//   const exchangeBookingId = req.params.id;
//   ExchangeBooking.findById(exchangeBookingId)
//     .populate("user", "username")
//     .populate("originalBooking")
//     .populate("exchangedBooking")
//     .then((exchangeBooking) => {
//       if (!exchangeBooking) {
//         return res.status(404).json({ error: "Exchange booking not found" });
//       }
//       res.json(exchangeBooking);
//     })
//     .catch(next);
// };

// // Accept a specific exchange booking by ID
// const acceptExchangeBooking = (req, res, next) => {
//   const exchangeBookingId = req.params.id;
//   ExchangeBooking.findByIdAndUpdate(
//     exchangeBookingId,
//     { status: "accepted" },
//     { new: true }
//   )
//     .then((exchangeBooking) => {
//       if (!exchangeBooking) {
//         return res.status(404).json({ error: "Exchange booking not found" });
//       }
//       res.json(exchangeBooking);
//     })
//     .catch(next);
// };

// // Decline a specific exchange booking by ID
// const declineExchangeBooking = (req, res, next) => {
//   const exchangeBookingId = req.params.id;
//   ExchangeBooking.findByIdAndUpdate(
//     exchangeBookingId,
//     { status: "declined" },
//     { new: true }
//   )
//     .then((exchangeBooking) => {
//       if (!exchangeBooking) {
//         return res.status(404).json({ error: "Exchange booking not found" });
//       }
//       res.json(exchangeBooking);
//     })
//     .catch(next);
// };

// module.exports = {
//   createExchangeBooking,
//   getAllExchangeBookings,
//   getExchangeBookingById,
//   acceptExchangeBooking,
//   declineExchangeBooking,
 
// };
