var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const materialRouter = require("./routes/materiel");
var app = express();
mongoose
  .connect("mongodb+srv://mariem:m5j3JwhbJaNufyoy@backbarmej.bnto6a9.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/materiels", materialRouter);
app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
