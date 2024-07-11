const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const CORS = require("cors");
const path = require("path");

//middlewares
app.use(express.json());
app.use(CORS());
app.use(express.urlencoded({ extened: true }));
app.use(express.static(path.join(__dirname, "client", "public")));
app.use("/", require("./routes/app"));

//DB Connection
const url =
  "mongodb+srv://Yash_test:test123@test-api.x7wjt0c.mongodb.net/interview";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Is Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

//Server Running
app.listen(PORT, () => {
  console.log(`App is Running On Port ${PORT}`);
});
