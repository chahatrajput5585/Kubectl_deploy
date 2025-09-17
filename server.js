const path = require("path");
const cors = require("cors");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
  // debug: true,
});
// const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
require("./config/db");

const viewRouters = require("./routers/view/view-router");
const api = require("./routers/api/api");

const app = express();

// Trust proxy for AWS Load Balancer
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.use(cors({
  credentials: true,
  origin: true
}));

// app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

// Set the view engine to ejs
app.set("view engine", "ejs");

// Set the views directory (optional if it's './views' by default)
app.set("views", path.join(__dirname, "views"));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRouters);
app.use("/api", api);

const PORT = 3000;
app.listen(PORT, async () => {
  // console.log("starting...");
  console.log(`Server running on port ${PORT}  on http://localhost:${PORT}`);
});

