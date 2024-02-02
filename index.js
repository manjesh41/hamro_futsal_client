require("dotenv").config();

const https = require("https");
const fs = require("fs");
const app = require("./app");

const port = process.env.PORT;
console.log(port);
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

// https
//   .createServer(
//     {
//       cert: fs.readFileSync("./localhost.crt"),
//       key: fs.readFileSync("./localhost.key"),
//     },
//     app
//   )

