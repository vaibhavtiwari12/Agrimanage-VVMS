const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
var compression = require('compression')
/* const { controller } = require('./Mongo/mongoController'); */
const MongoRouter = require("./Router/mongoRouter");
const KisanRouter = require("./Router/kisanRouter");
const inventoryRouter = require("./Router/inventoryRouter");

const session = require("express-session");
const loginRouter = require("./Router/loginRouter");
const middlewares = require("./Middleware/middleware");
const { controller } = require("./Mongo/loginController");
const purchaserRouter = require("./Router/purchaserRouter");
const  { generateDashboard} = require("./Utilities/utility");

var MongoDBStore = require("connect-mongodb-session")(session);

//Conifiguring the dotenv to read the env file variables.
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();

// -------------------------------- Enabling Compression on requests ----------------------------
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}
app.use(compression({ filter: shouldCompress }));
// -------------------------------- Enabling Compression on requests ----------------------------
// -------------------------------- Session initilization ----------------------------
var store = new MongoDBStore({
  uri: `${process.env.MONGO_URL}`,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});
// -------------------------------- Session initilization ----------------------------

app.listen(process.env.PORT || 3001);
console.log(`Server has Started`);

//Creating MONGO Connection
/* (async () => await controller("Patch",{id:'60ec52b2fb729b44c4e48667'}))(); */

//Creating the build folder path tos erver static resource from build.
app.use(express.static(path.join(__dirname, "build")));

//Enable JSON POST REQUEST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMW = session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: store,
  cookie: {
    httpOnly: true,
    maxAge: 3600000,
  },
});

app.use("/mongo", sessionMW, middlewares.isAuthenticated, MongoRouter);
app.use("/kisan", sessionMW, middlewares.isAuthenticated, KisanRouter);
app.use("/login", sessionMW, middlewares.isAuthenticated, loginRouter);
app.use("/inventory", sessionMW, middlewares.isAuthenticated, inventoryRouter);
app.use("/purchaser", sessionMW, middlewares.isAuthenticated, purchaserRouter);

app.post("/getLogin", sessionMW, async (req, res) => {
  const logins = await controller("get", {
    userName: req.body.userName,
    password: req.body.password,
  });
  if (logins && Object.keys(logins).length > 0) {
    req.session.user = req.body.userName;
    console.log("Session", req.session.id);
    res.status(200).send({ logins });
  } else {
    res
      .status(400)
      .send({ success: false, message: "Invalid UserName or Password!" });
  }
});

app.get("/logout", sessionMW, (req, res) => {
  console.log("logout session", req.session);
  if (req.session) {
    req.session.destroy();
    delete req.session;
  }
  res.status(200).send({ message: "Logout SuccessFul" });
});

app.post("/addUser", sessionMW, async (req, res) => {
  console.log("Request ", req.body);
  const logins = await controller("add", {
    userName: req.body.userName,
    password: req.body.password,
  });
  res.json(logins);
});
app.get(
  "/hasValidSession",
  sessionMW,
  middlewares.isAuthenticated,
  (req, res) => {
    res.json({ validSession: true, User: req.session.user });
  }
);

app.get('/dashboardinfo',async  (req,res) => {
    console.log("Porcessing Dashboard Information")
    const generatedData = await generateDashboard();
    res.json(generatedData)
})

// ALL the API Calls Get Here
app.get("/api/getName", (req, res) => {
  res.send({ message: "hello From API" });
});
app.get("/api/heartbeat", (req, res) => {
  console.log(process.env.NODE_PORT);
  res.send({ message: "Backend Application is alive." });
});

//serve the static files from the server.
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
