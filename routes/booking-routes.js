const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking-controller");
const { verifyAdmin, verifyUser } = require("../middlewares/auth");

// Create a new booking
router.post("/futsalbooking", bookingController.createBooking);

// Get all bookings
router.get("/allbooking", bookingController.getAllBooking);

// Get a specific booking by ID
router.get("/BookingById", verifyUser, bookingController.getBookingById);
// Update a specific booking by ID
router.put("/:id", bookingController.updateBookingById);

// Accept booking by admin
router.put("/:id/accept", verifyAdmin, bookingController.acceptBooking);

// Decline booking by admin
router.put("/:id/decline", verifyAdmin, bookingController.declineBooking);

// Delete a specific booking by ID
router.delete("/:id", bookingController.deleteBookingById);

// Get booking by booking id
router.get("/:id", bookingController.getBookingByBookingId);

module.exports = router;
