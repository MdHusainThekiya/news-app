const express = require("express");
const path = require("path");
require("dotenv").config();
const redisClient = require("./redisClient");
const userSignUp = require("./routers/userSIgnUp");
const userLogIn = require("./routers/userLogIn");
const newsCategory = require("./routers/private/newsCategory");
const newsArticle = require("./routers/private/newsArticle");
const userSessions = require("./routers/private/userSessions");
const cors = require("cors");
const app = express();

// Create Routers
app.use(express.json());
app.use(cors());
app.use("/signup", userSignUp);
app.use("/login", userLogIn);
app.use("/newscategory", newsCategory);
app.use("/newsarticle", newsArticle);
app.use("/usersessions", userSessions);

//  Connecting Heroku
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Listen Routers
const port = process.env.PORT || 4000;
app.listen(port, console.log(`Listning on port ${port}`));

// Connecting Redis Server One Time
// async function redisClientConnect() {
//   try {
//     await redisClient.redisClientConnect();
//   } catch (error) {
//     console.log(
//       "Unable to connect with redisClient In Index.Js =>",
//       error.message
//     );
//   }
// }
// redisClientConnect();
