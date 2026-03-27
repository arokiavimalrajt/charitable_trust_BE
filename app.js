const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 4000;

app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const commonRoutes = require("./routes/common");
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);
app.use(commonRoutes);

app.listen(port);
