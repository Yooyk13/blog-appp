const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword, // Store the hashed password in the database
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token with a one-day expiry time
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return the token in the response
    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the provided email
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    // If the password matches, generate a JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Return the token in the response
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const whoAmI = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the username in the response
    res.status(200).json({ username: user.username });
  } catch (err) {
    // Handle invalid or expired token errors
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { createUser, loginUser, whoAmI };
