const express = require('express');
const app = express(); // initialize express in app

const path = require('node:path');

// Middleware to allow us to correctly parse the incoming request’s body
app.use(express.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Allow to use static assets from public folder
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

// Use index router
const indexRouter = require('./routes/indexRouter');
app.use('/', indexRouter);

// To handle errors
// Every thrown error in the application or the previous middleware function calling `next` with an error as an argument will eventually go to this middleware function
app.use((err, req, res, next) => {
  console.error(err);
  // We specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app - listening on port ${PORT}!`);
});
