const Booking = require("../models/Booking");

const getAllBooking = (req, res, next) => {
  Booking.find()
    .then((bookings) => {
      res.json({ data: bookings });
    })
    .catch(next);
};

const getBookingById = async (req, res) => {
  const user = req.user;
  console.log(user.id);
  const response = await Booking.find({ user: user.id });
  res.status(200).json({ response });
};

// Create a new booking
const createBooking = (req, res, next) => {
  const userId = req.user.id;
  const bookingData = {
    user: userId,
    ...req.body,
  };

  console.log(req.body.bookingDate);
  console.log(req.body.startTime);
  console.log(req.body.endTime);

  Booking.findOne({
    bookingDate: req.body.bookingDate,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
  })
    .then((result) => {
      if (!result) {
        Booking.create(bookingData).then((bookingMade) => {
          res.status(201).json({
            status: "success",
          });
        });
      } else {
        res.status(400).json({ message: "Booking already exists." });
      }
    })
    .catch(next);
};

// Update a specific booking by ID
const updateBookingById = (req, res, next) => {
  const bookingId = req.params.id;
  const { user, fullname, bookingDate, startTime, endTime, phoneNum, email } =
    req.body;
  Booking.findByIdAndUpdate(
    bookingId,
    {
      user,
      fullname,
      bookingDate,
      startTime,
      endTime,
      phoneNum,
      email,
    },
    { new: true }
  )
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    })
    .catch(next);
};

// Delete a specific booking by ID
const deleteBookingById = (req, res, next) => {
  const bookingId = req.params.id;
  Booking.findByIdAndRemove(bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json({ message: "Booking deleted successfully" });
    })
    .catch(next);
};

const acceptBooking = (req, res, next) => {
  const bookingId = req.params.id;

  Booking.findByIdAndUpdate(bookingId, { status: "accepted" }, { new: true })
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Optionally, you can perform additional logic based on the updated status
      // For example, send a notification to the user or perform any other action

      res.json(booking);
    })
    .catch(next);
};

const declineBooking = (req, res, next) => {
  const bookingId = req.params.id;

  Booking.findByIdAndUpdate(bookingId, { status: "declined" }, { new: true })
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Optionally, you can perform additional logic based on the updated status
      // For example, send a notification to the user or perform any other action

      res.json(booking);
    })
    .catch(next);
};

// Get booking by booking id
const getBookingByBookingId = (req, res, next) => {
  const bookingId = req.params.id;
  Booking.findById(bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    })
    .catch(next);
};

module.exports = {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBookingById,
  deleteBookingById,
  acceptBooking,
  declineBooking,
  getBookingByBookingId,
};
