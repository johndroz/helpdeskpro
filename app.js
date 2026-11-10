const express = require('express');
const session = require('express-session');
const loginRoutes = require('./routes/loginRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const staffRoutes = require('./routes/staffRoutes');
const { requireAuth } = require('./middleware/authenticate');


//settings for the express server
const app = express();
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static("public", { index: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));



// ROUTES
app.use("/", loginRoutes);

//PROTECT EVERYTHING
app.use(requireAuth);

//PROTECTED ROUTES
app.use('/employees', employeeRoutes);
app.use('/staff', staffRoutes);


// set external port for express server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});