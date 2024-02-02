const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/User");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const mongoose = require("mongoose");
let token = "";

beforeAll(async () => {
  await User.deleteMany();
  await Booking.deleteMany();
  await Review.deleteMany();
});

describe("Test the review route", () => {
  test("Create a review", async () => {
    const registerRes = await api.post("/users/register").send({
      userName: "testUser66",
      password: "testPassword66",
      fname: "testFname",
      email: "testEmail66",
      lname: "testLname",
      phoneNum: "testPhoneNum66",
      role: "admin",
    });

    const res = await api.post("/users/login").send({
      userName: "testUser66",
      password: "testPassword66",
    });

    token = res.body.token;

    const user = await User.findOne({ userName: "testUser66" });

    const res2 = await api
      .post("/reviews/createReview")
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "this is my review which is very long and very good",
        user: user._id,
      });

    expect(res2.body.text).toBe(
      "this is my review which is very long and very good"
    );
  });

  test("Get all reviews", async () => {
    const res = await api
      .get("/reviews/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data.length).toBe(1);
  });

  test("Get a review by id", async () => {
    const reviews = await Review.find();
    const res = await api
      .get(`/reviews/${reviews[0]._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.text).toBe(
      "this is my review which is very long and very good"
    );
  });

  test("Update a review", async () => {
    const reviews = await Review.find();
    const res = await api
      .put(`/reviews/${reviews[0]._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "this is my updated review which is very long and very good",
      });

    expect(res.body.text).toBe(
      "this is my updated review which is very long and very good"
    );
  });

  test("Delete a review", async () => {
    const reviews = await Review.find();
    const res = await api
      .delete(`/reviews/${reviews[0]._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.text).toBe(
      "this is my updated review which is very long and very good"
    );
  });
});
