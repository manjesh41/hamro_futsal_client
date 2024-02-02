const Review = require("../models/Review");

const getAllReviews = (req, res, next) => {
  Review.find()
    //for flutter app
    // .populate("user") // Populate the user field with the associated user data
    .then((reviews) => {
      res.json({ data: reviews });
    })
    .catch(next);
};

const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviewData = {
      ...req.body,
      user: userId,
    };
    const review = await Review.create(reviewData);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const deleteAllReviews = (req, res, next) => {
  Review.deleteMany()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
};

const getReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }
      res.json(review);
    })
    .catch(next);
};

const updateReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  const { user, text } = req.body;
  Review.findByIdAndUpdate(
    reviewId,
    {
      user,
      text,
    },
    { new: true }
  )
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }
      res.json(review);
    })
    .catch(next);
};

const deleteReviewById = (req, res, next) => {
  const reviewId = req.params.id;
  Review.findByIdAndDelete(reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }
      res.json(review);
    })
    .catch(next);
};

module.exports = {
  getAllReviews,
  createReview,
  deleteAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
