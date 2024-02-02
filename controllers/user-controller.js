const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Check if the new password is different from the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password",
      });
    }

    // Check if the new password is the same as any of the user's previous passwords
    const previousPasswords = user.previousPasswords || [];
    const isPreviousPassword = await Promise.all(
      previousPasswords.map(async (prevPassword) => {
        return await bcrypt.compare(newPassword, prevPassword);
      })
    );

    if (isPreviousPassword.includes(true)) {
      return res.status(400).json({
        error: "New password cannot be the same as any of the previous passwords",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;

    // Add the current password to the list of previous passwords
    user.previousPasswords = [user.password, ...previousPasswords].slice(0, 5); // Keep the latest 5 passwords

    // Save the updated user
    await user.save();

    res.status(204).json({ message: "Password updated successfully" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { userName, phoneNum, email, fname, lname } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //       // Update the fields only if they are different from the existing values
    if (userName && userName !== "" && userName !== user.userName) {
      user.userName = userName;
    }
    if (phoneNum && phoneNum !== "" && phoneNum !== user.phoneNum) {
      user.phoneNum = phoneNum;
    }
    if (email && email !== "" && email !== user.email) {
      user.email = email;
    }
    if (fname && fname !== "" && fname !== user.fname) {
      user.fname = fname;
    }
    if (lname && lname !== "" && lname !== user.lname) {
      user.lname = lname;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      data: [user],
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    res.status(200).send({
      success: true,

      message: "User deleted successfully",

      data: user,
    });
  } catch (error) {
    /* istanbul ignore next */
    console.log(error);

    res.status(500).send({
      success: false,

      message: "Error while deleting user",

      error,
    });
  }
};

// get user by id
const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      /* istanbul ignore next */
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updatePassword,
  updateUserProfile,
  getUserProfile,
  deleteUserController,
  getUserByIdController,
};
