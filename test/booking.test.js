const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/User");
const Booking = require("../models/Booking");

const mongoose = require("mongoose");
let token = "";

beforeAll(async () => {
  await User.deleteMany();
  await Booking.deleteMany();
});

test("add booking", async () => {
  await api.post("/users/register").send({
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
  console.log(res.body);

  let playerId = "101";
  const ress = await api
    .post(`/booking/futsalbooking`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      playerId: playerId,
      fullname: "test player",
      bookingDate: new Date(),
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      phoneNum: "1234567890",
      email: "test@gmail.com",
    })
    .expect(201);

  expect(ress.body.status).toBe("success");
});

test("get all booking", async () => {
  const res = await api
    .get(`/booking/allbooking`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  expect(res.body.data).toHaveLength(1);
});

// test("get booking by id", async () => {
//   let bookingId = "101";
//   const res = await api
//     .get(`/booking/${bookingId}`)
//     .set("Authorization", `Bearer ${token}`)
//     .expect(200);

//   expect(res.body.data.fullname).toBe("test player");
// });

test("Get booking by id", async () => {
  const bookings = await Booking.find({});
  const booking = bookings[0];
  await api
    .get(`/booking/${booking._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.fullname).toBe("test player");
    });
});

test("update booking", async () => {
  const bookings = await Booking.find({});
  const booking = bookings[0];

  await api
    .put(`/booking/${booking._id}`)
    .set("authorization", `Bearer ${token}`)
    .send({
      fullname: "test player updated",
    })
    .expect(200)

    .expect("Content-Type", /application\/json/);

  const bookingsAtEnd = await Booking.find({});
  expect(bookingsAtEnd[0].fullname).toBe("test player updated");
});

test("accept booking", async () => {
  const bookings = await Booking.find({});
  const booking = bookings[0];

  await api
    .put(`/booking/${booking._id}/accept`)
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const bookingsAtEnd = await Booking.find({});
  expect(bookingsAtEnd[0].status).toBe("accepted");
});

test("decline booking", async () => {
  const bookings = await Booking.find({});
  const booking = bookings[0];

  await api
    .put(`/booking/${booking._id}/decline`)
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const bookingsAtEnd = await Booking.find({});
  expect(bookingsAtEnd[0].status).toBe("declined");
});

test("delete booking", async () => {
  const bookings = await Booking.find({});
  const booking = bookings[0];

  await api
    .delete(`/booking/${booking._id}`)
    .set("authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const bookingsAtEnd = await Booking.find({});
  expect(bookingsAtEnd).toHaveLength(0);
});
