const supertest = require("supertest");

const app = require("../app");

const api = supertest(app);

const User = require("../models/User");

const mongoose = require("mongoose");

let validToken;

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User registration", () => {
  test("user registration", async () => {
    const res = await api
      .post("/users/register")
      .send({
        userName: "testUser",
        password: "testPassword",
        fname: "testFname",
        email: "testEmail",
        lname: "testLname",
        phoneNum: "testPhoneNum",
      })
      .expect(201);

    expect(res.body.user.userName).toBe("testUser");
  });

  test("duplicate username", async () => {
    const res = await api
      .post("/users/register")
      .send({
        userName: "testUser",
        password: "testPassword",
        fname: "testFname",
        email: "testEmail",
        lname: "testLname",
        phoneNum: "testPhoneNum",
      })
      .expect(400);

    expect(res.body.error).toBe("Duplicate userName");
  });

  test("missing username", async () => {
    const res = await api
      .post("/users/register")
      .send({
        password: "testPassword",
        fname: "testFname",
        email: "testEmail",
        lname: "testLname",
        phoneNum: "testPhoneNum",
      })
      .expect(400);

    expect(res.body.error).toBe(
      "User validation failed: userName: Please enter the username"
    );
  });

  test("registered user can login", async () => {
    const res = await api
      .post("/users/login")
      .send({
        userName: "testUser",
        password: "testPassword",
      })
      .expect(200);

    expect(res.body.status).toBe("success");

    validToken = res.body.token;
    console.log(validToken);
  });

  test("unregistered user cannot login", async () => {
    const res = await api
      .post("/users/login")
      .send({
        userName: "testUserrrr",
        password: "testPassword",
      })
      .expect(400);

    expect(res.body.error).toBe("User is not registered");
  });

  test("update password - incorrect current password", async () => {
    const res = await api
      .put("/users/change-password")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        currentPassword: "wrongPassword",
        newPassword: "newPassword123",
        confirmPassword: "newPassword123",
      })
      .expect(401);

    expect(res.body.error).toBe("Incorrect current password");
  });

  test("update password - new password and confirm password do not match", async () => {
    const res = await api
      .put("/users/change-password")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        currentPassword: "testPassword",
        newPassword: "newPassword123",
        confirmPassword: "mismatchPassword",
      })
      .expect(400);

    expect(res.body.error).toBe(
      "New password and confirm password do not match"
    );
  });

  test("update password - new password same as current password", async () => {
    const res = await api
      .put("/users/change-password")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        currentPassword: "testPassword",
        newPassword: "testPassword",
        confirmPassword: "testPassword",
      })
      .expect(400);

    expect(res.body.error).toBe(
      "New password must be different from the current password"
    );
  });

  test("update password - successful", async () => {
    const res = await api
      .put("/users/change-password")
      .set("Authorization", `Bearer ${validToken}`) // Use the stored token
      .send({
        currentPassword: "testPassword",
        newPassword: "newPassword",
        confirmPassword: "newPassword",
      })
      .expect(204);

    // Perform login with the updated password
    const loginRes = await api
      .post("/users/login")
      .send({
        userName: "testUser",
        password: "newPassword",
      })
      .expect(200);

    expect(loginRes.body.token).toBeDefined();
  });

  //edit user profile

  test("edit user profile", async () => {
    const res = await api
      .put("/users/edit-profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        userName: "testUser",
        fname: "testFname",
        email: "testEmail",
        lname: "testLname",
        phoneNum: "testPhoneNum",
      })
      .expect(200);
  });

  test("get user profile", async () => {
    const res = await api
      .get("/users/usersId")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data[0].userName).toBe("testUser");
  });

  test("delete user profile", async () => {
    // create a new user
    const res = await api
      .post("/users/register")
      .send({
        userName: "testUser2",
        password: "testPassword",
        fname: "testFname",
        email: "testEmail",
        lname: "testLname",
        phoneNum: "testPhoneNum",
      })
      .expect(201);

    // login with the new user
    const loginRes = await api
      .post("/users/login")
      .send({
        userName: "testUser2",
        password: "testPassword",
      })
      .expect(200);

    const userId = res.body.user._id;

    // delete the new user
    const deleteRes = await api
      .delete(`/users/deleteUsers/${userId}`)
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .expect(200);

    expect(deleteRes.body.message).toBe("User deleted successfully");
  });

  test("get user by ID", async () => {
    const newUser = await User.create({
      userName: "testUser88",
      password: "testPassword88",
      fname: "testFname",
      email: "testEmail88",
      lname: "testLname",
      phoneNum: "testPhoneNum88",
    });

    const res = await api
      .get(`/users/${newUser._id}`)
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);

    expect(res.body.data.userName).toBe("testUser88");
  });
});

afterAll(async () => await mongoose.connection.close());
