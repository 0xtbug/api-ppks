require("dotenv").config();
require("./config/dbConnection");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoute");

const app = express();

app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());

app.use("/api", userRouter);

// Error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(process.env.PORT_SERVER, () => console.log(`Server running in port ${process.env.PORT_SERVER}`));
