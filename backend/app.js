const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './.env') });
var compression = require('compression');
/* const { controller } = require('./Mongo/mongoController'); */
const MongoRouter = require('./Router/mongoRouter');
const KisanRouter = require('./Router/kisanRouter');
const inventoryRouter = require('./Router/inventoryRouter');
const identificationTypeRouter = require('./Router/identificationTypeRouter');

const session = require('express-session');
const loginRouter = require('./Router/loginRouter');
const middlewares = require('./Middleware/middleware');
const { controller } = require('./Mongo/loginController');
const purchaserRouter = require('./Router/purchaserRouter');
const {
  generateDashboard,
  getYearWiseDBCollection,
  setYearWiseDBCollection,
} = require('./Utilities/utility');
const yearRouter = require('./Router/yearRouter');
const { createDBConnection } = require('./Mongo/mongoConnector');

var MongoDBStore = require('connect-mongodb-session')(session);

//Conifiguring the dotenv to read the env file variables.

const app = express();

// Initialize MongoDB connection at startup
const initializeApp = async () => {
  try {
    await createDBConnection();

    // Set default year (current academic year)
    const currentYear = new Date().getFullYear();
    const defaultYear = `${currentYear}-${(currentYear + 1).toString().slice(2)}`;
    process.YEAR = defaultYear;
    setYearWiseDBCollection(defaultYear);
    console.log(`[Backend] [INFO] Default year set to: ${defaultYear}`);

    console.log('[Backend] [SUCCESS] Application initialized with database connection');
  } catch (error) {
    console.error('[Backend] [ERROR] Failed to initialize application:', error);
    // Don't exit - let the app continue and try to reconnect when needed
  }
};

// Start initialization
initializeApp();

// -------------------------------- Enabling Compression on requests ----------------------------
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
};
app.use(compression({ filter: shouldCompress }));
// -------------------------------- Enabling Compression on requests ----------------------------
// -------------------------------- Session initilization ----------------------------
var store = new MongoDBStore({
  uri: `${process.env.MONGO_URL}`,
  collection: 'mySessions',
});
store.on('error', function (error) {
  console.log(error);
});
// -------------------------------- Session initilization ----------------------------

app.listen(process.env.PORT || 3001);
console.log(`Server has Started`);

//Creating MONGO Connection
/* (async () => await controller("Patch",{id:'60ec52b2fb729b44c4e48667'}))(); */

//Creating the build folder path tos erver static resource from build.
app.use(express.static(path.join(__dirname, 'build')));

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
//app.use("/mongo", sessionMW, middlewares.isAuthenticated, MongoRouter);
app.use('/kisan', sessionMW, middlewares.isAuthenticated, KisanRouter);
app.use('/login', sessionMW, middlewares.isAuthenticated, loginRouter);
app.use('/inventory', sessionMW, middlewares.isAuthenticated, inventoryRouter);
app.use('/purchaser', sessionMW, middlewares.isAuthenticated, purchaserRouter);
app.use('/year', sessionMW, middlewares.isAuthenticated, yearRouter);
app.use('/identificationTypes', sessionMW, middlewares.isAuthenticated, identificationTypeRouter);

app.post('/yearChange', sessionMW, middlewares.isAuthenticated, (req, res) => {
  console.log('Year from body', req.body.year);

  // Convert numeric year to academic year format (e.g., 2024 -> "2024-25")
  let yearString;
  if (typeof req.body.year === 'number') {
    const year = req.body.year;
    yearString = `${year}-${(year + 1).toString().slice(2)}`;
  } else {
    yearString = req.body.year;
  }

  console.log('Converted year string:', yearString);

  req.session.year = yearString; // Save year in session
  process.YEAR = yearString;
  console.log('Year post Update', process.YEAR);
  setYearWiseDBCollection(process.YEAR);
  res.status(200).json({ year: yearString });
});

app.get('/api/getYear', sessionMW, middlewares.isAuthenticated, (req, res) => {
  res.status(200).json({ year: req.session.year });
});

app.post('/getLogin', sessionMW, async (req, res) => {
  try {
    const logins = await controller('get', {
      userName: req.body.userName,
      password: req.body.password,
    });
    if (logins) {
      // Simplified check
      req.session.user = req.body.userName;
      console.log('Session', req.session.id);
      res.status(200).send({ logins });
    } else {
      res.status(400).send({ success: false, message: 'Invalid UserName or Password!' });
    }
  } catch (error) {
    console.error('[Backend] [ERROR] Login failed:', error);
    res.status(500).send({ success: false, message: 'Login service temporarily unavailable' });
  }
});

app.get('/logout', sessionMW, (req, res) => {
  console.log('logout session', req.session);
  if (req.session) {
    req.session.destroy();
    delete req.session;
  }
  res.status(200).send({ message: 'Logout SuccessFul' });
});

app.post('/addUser', sessionMW, async (req, res) => {
  try {
    console.log('Request ', req.body);
    const logins = await controller('add', {
      userName: req.body.userName,
      password: req.body.password,
    });
    res.json(logins);
  } catch (error) {
    console.error('[Backend] [ERROR] Add user failed:', error);
    res
      .status(500)
      .json({ success: false, message: 'User creation service temporarily unavailable' });
  }
});
app.get('/hasValidSession', sessionMW, middlewares.isAuthenticated, (req, res) => {
  res.json({ validSession: true, User: req.session.user });
});

app.get('/dashboardinfo', async (req, res) => {
  try {
    console.log('Processing Dashboard Information');
    const generatedData = await generateDashboard();
    res.json(generatedData);
  } catch (error) {
    console.error('[Backend] [ERROR] Dashboard generation failed:', error);
    res.status(500).json({ error: 'Dashboard service temporarily unavailable' });
  }
});

// API endpoints for getting all defaulters for export
app.get('/api/all-kisan-defaulters', sessionMW, async (req, res) => {
  try {
    console.log('Processing All Kisan Defaulters Request');

    // Get year from session or use current process.YEAR
    const year = req.session.year || process.YEAR;
    if (year) {
      setYearWiseDBCollection(year);
    }

    const { getAllKisanDefaulters } = require('./Utilities/utility');

    const allKisanDefaulters = await getAllKisanDefaulters();

    res.json(allKisanDefaulters);
  } catch (error) {
    console.error('[Backend] [ERROR] All Kisan Defaulters failed:', error);
    res.status(500).json({ error: 'Unable to fetch kisan defaulters data' });
  }
});

app.get('/api/all-purchaser-defaulters', sessionMW, async (req, res) => {
  try {
    console.log('Processing All Purchaser Defaulters Request');

    // Get year from session or use current process.YEAR
    const year = req.session.year || process.YEAR;
    if (year) {
      setYearWiseDBCollection(year);
    }

    const { getAllPurchaserDefaulters } = require('./Utilities/utility');

    const allPurchaserDefaulters = await getAllPurchaserDefaulters();

    res.json(allPurchaserDefaulters);
  } catch (error) {
    console.error('[Backend] [ERROR] All Purchaser Defaulters failed:', error);
    res.status(500).json({ error: 'Unable to fetch purchaser defaulters data' });
  }
});

// ALL the API Calls Get Here
app.get('/api/getName', (req, res) => {
  res.send({ message: 'hello From API' });
});
app.get('/api/heartbeat', (req, res) => {
  console.log(process.env.NODE_PORT);
  res.send({ message: 'Backend Application is alive.' });
});

// Database health check
app.get('/api/db-health', async (req, res) => {
  try {
    const { getConnectionStatus } = require('./Mongo/mongoConnector');
    const status = getConnectionStatus();
    res.json({
      status: status.isConnected ? 'connected' : 'disconnected',
      readyState: status.readyStateString,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Global error handler for MongoDB issues
app.use((err, req, res, next) => {
  console.error('[Backend] [ERROR] Request failed:', err);

  // Check if it's a MongoDB connection error
  if (
    err.message &&
    (err.message.includes('Topology is closed') || err.message.includes('MongoError'))
  ) {
    return res.status(503).json({
      error: 'Database temporarily unavailable',
      message: 'Please try again in a moment',
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong',
  });
});

//serve the static files from the server.
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
