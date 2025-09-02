const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/user");

const getUserById = async (id) => {
  return await User.findById(id);
};

const signoutHandler = async (req, res, next) => {
  try {
    console.log("🚪 Logout request received from:", req.get("host"));
    console.log("🍪 Current cookies:", req.cookies);

    // Cookie clearing strategy for AWS Kubernetes environment
    const cookieOptions = {
      httpOnly: true,
      secure:
        process.env.COOKIE_SECURE === "true" ||
        (process.env.NODE_ENV === "production" &&
          process.env.COOKIE_SECURE !== "false"),
      sameSite: "lax",
      path: "/",
      ...(process.env.COOKIE_DOMAIN
        ? { domain: process.env.COOKIE_DOMAIN }
        : {}),
    };

    // Clear with consistent options (matching login)
    res.clearCookie("jwt", cookieOptions);

    // Fallback clearing for different environments
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // Fallback for load balancer SSL termination
      sameSite: "lax",
      path: "/",
    });

    // Set expired cookie to ensure clearing
    res.cookie("jwt", "", {
      ...cookieOptions,
      expires: new Date(0),
      maxAge: 0,
    });

    // Add headers to prevent caching
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");

    console.log("✅ User logged out successfully");

    // Check if it's an AJAX request
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
        redirect: "/",
      });
    }

    return res.redirect("/");
  } catch (error) {
    console.error("❌ Signout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const signinHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("email=>", email);
    console.log("password=>", password);

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Check if email exists in the database
    const user = await User.findOne({ email }); // Corrected $where syntax

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // Token expires in 30 days
      }
    );

    // const cookieOptions = {
    //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    //   secure:
    //     process.env.COOKIE_SECURE === "true" ||
    //     (process.env.NODE_ENV === "production" &&
    //       process.env.COOKIE_SECURE !== "false"),
    //   sameSite: "lax",
    //   path: "/",
    //   ...(process.env.COOKIE_DOMAIN
    //     ? { domain: process.env.COOKIE_DOMAIN }
    //     : {}),
    // };

    const cookieOptions = {
      httpOnly: false, // so you can see it in document.cookie (not secure, but easier for debugging)
      secure: false, // works on localhost without HTTPS
      sameSite: "lax", // safe default, still allows most flows
      path: "/", // available across the app
    };
    console.log("Setting login cookie with options:", cookieOptions);

    res.cookie("jwt", token, cookieOptions);
    // 4. Success: Return response to trigger redirect
    res.status(200).json({
      data: {
        message: "Alright",
        token,
        cookieOptions,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Signup API handler
const signupHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Success
    res.status(200).json({
      data: {
        message: "Sign up successful",
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserById,
  signinHandler,
  signupHandler,
  signoutHandler,
};
