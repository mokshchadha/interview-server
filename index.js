const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 7000;
const cors = require("cors");

const { sendTheData } = require("./repo");

const connectionString =
  "mongodb+srv://moksh:test1234temp4321@cluster0.httpz.mongodb.net/" +
  "sample_training?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI || connectionString, {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false,
});

async function printRequest(req) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;
  const date = new Date();
  console.log(`[${date.toDateString()}] ${ip} ${req.method} ${req.url}`);
}

function logger(req, res, next) {
  printRequest(req);
  next();
}

app.use(logger);
app.use(cors());

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ msg: "Hello From Server" }));
});

app.get("/listCompanies", async function (req, res) {
  const data = await mongoose.connection.db
    .collection("companies")
    .find({})
    .limit(50)
    .toArray();
  console.log({ data });
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ data }));
});
app.get("/listCompaniesFast", async function (req, res) {
  const data = await mongoose.connection.db
    .collection("companies")
    .find(
      { number_of_employees: { $gt: 5 } },
      {
        name: 1,
        number_of_employees: 1,
        founded_year: 1,
        email_address: 1,
        phone_number: 1,
        overview: 1,
        products: 1,
        description: 1,
        category_code: 1,
        founded_monthL: 1,
      }
    )
    .limit(50)
    .toArray();
  // console.log({ data });
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ data }));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
