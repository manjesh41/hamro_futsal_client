const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");
const userController = require("../controllers/user-controller");
const passwordRecoveryController = require("../controllers/passwordRecoveryController");

// Upload image
// router.post("/upload-image", upload.single("image"), (req, res, next) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "Image file not provided" });
//   }
//   const imagePath = req.file.path;
//   res.json({ imagePath });
// });

// Register a new user with password policies
router.post("/register", async (req, res, next) => {
  const { userName, password, fname, email, lname, phoneNum, role } = req.body;

  try {
    // Check for duplicate username
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "Duplicate userName" });

    }
    
    // Check if the password is the same as the user's name or email
    if (password === userName || password === email) {
      return res.status(400).json({
        error: "Password cant include user details",
      });
    }

    // Password Length: Check password length
    if (password.length < 8 || password.length > 12) {
      return res.status(400).json({
        error: "Password length should be between 8 to 12 characters",
      });
    }

    // Password Complexity: Check for uppercase, lowercase, numbers, and special characters
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password should include at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Password History: Check if the proposed password matches any previous passwords (implement your logic)

    // Password Expiry: (Implement your logic to check password expiration date)

    // Account Lockout: (Implement logic to track failed login attempts and lock account)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      userName,
      password: hashedPassword,
      email,
      phoneNum,
      fname,
      lname,
      role,
    });

    res.status(201).json({ status: "success", user: newUser });
  } catch (error) {
    next(error);
  }
});

// Other routes...

// Login user

router.post("/login", async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({ error: "Invalid username" });
    }

    if (user.accountLocked) {
      const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
      const lockoutDurationMinutes = lockoutDurationMillis / (60 * 1000); // convert to minutes

      const lockoutDuration = 5; // Lockout duration in minutes (configurable)

      if (lockoutDurationMinutes >= lockoutDuration) {
        // Unlock the account
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        user.lastFailedLoginAttempt = null;
        await user.save();
      } else {
        const remainingTime = Math.ceil(
          lockoutDuration - lockoutDurationMinutes
        ); // Calculate remaining time rounded up
        return res.status(400).json({
          error: `Account is locked. Please try again later after ${remainingTime} minute(s).`,
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts and update last failed login timestamp
      user.failedLoginAttempts += 1;
      user.lastFailedLoginAttempt = Date.now();

      if (user.failedLoginAttempts >= 5) {
        // Lock the account
        user.accountLocked = true;
        await user.save();
        return res
          .status(400)
          .json({ error: "Account is locked. Please try again later." });
      }

      const remainingAttempts = 5 - user.failedLoginAttempts;
      await user.save();
      return res.status(400).json({
        error: `Invalid password. Remaining login attempts: ${remainingAttempts}`,
      });
    }

    // Reset failed login attempts and last failed login timestamp on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAttempt = null;
    await user.save();

    // Check if the account is still locked after successful login
    if (user.accountLocked) {
      return res
        .status(400)
        .json({ error: "Account is locked. Please try again later." });
    }

    const payload = {
      id: user._id,
      userName: user.userName,
      fname: user.fname,
      role: user.role,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) return res.status(500).json({ error: err.message });
      console.log(`Successful login for user: ${userName}`);
      res.json({ status: "success", token: token });
    });
  } catch (error) {
    next(error);
  }
});

router.put("/change-password", verifyUser, userController.updatePassword);

// Update user profile
router.put("/edit-profile", verifyUser, userController.updateUserProfile);

router.get("/usersId", verifyUser, userController.getUserProfile);

// Fetch all users
router.get("/allUsers", (req, res, next) => {
  User.find()
    .then((users) => {
      console.log(users);
      res.json({ data: users });
    })
    .catch(next);
});

router.delete(
  "/deleteUsers/:userId",

  userController.deleteUserController
);

// Get user by id
router.get(
  "/:userId",

  userController.getUserByIdController
);

router.post(
  "/password-recovery/request-password-reset",
  passwordRecoveryController.requestPasswordReset
);
router.post(
  "/password-recovery/reset-password/:token",
  passwordRecoveryController.resetPassword
);

module.exports = router;
