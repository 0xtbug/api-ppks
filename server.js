require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoute");
const adminAppRouter = require("./routes/adminAppRoute");
const adminWebRouter = require("./routes/adminWebRoute");

const app = express();

app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("ngapain dek");
});

app.use("/api", userRouter);
app.use("/api", adminAppRouter);
app.use("/api", adminWebRouter);

// Error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

const PORT = process.env.PORT_SERVER || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));