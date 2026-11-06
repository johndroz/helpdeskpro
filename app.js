const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('./models/userModel');


//settings for the express server
const app = express();
require("dotenv").config();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

// ROUTES UNPROTECTED
app.get('/', (req, res) => {
    //check if user is logged in.
    if(req.session && req.session.user){
        const role = req.session.user.role;
        if(role == "Employee") return res.sendFile(path.join(__dirname, "pages/employees/employee.html"));
        else if (role === 'IT_Staff') return res.sendFile(path.join(__dirname, ""));
    }
    
    return res.sendFile(path.join(__dirname, "index.html"));
});

// ROUTE FOR LOGIN AUTHENTICATION
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = userModel.findUserByUsername(username);
    //send error as query parameters for failed logins to display to user
    if (!user) {
        return res.redirect("/?error=user")
    } 

    //const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (password != user.password_hash){
        return res.redirect("/?error=invalid")
    }
    //create session for successful login
    req.session.user = {
      userID: user.userID,
      email: user.email,
      role: user.role
    };
    //redirect user based on role
    if (user.role === 'Employee') return res.sendFile(path.join(__dirname, "pages/employees/employee.html"));
    else if (user.role === 'IT_Staff') return res.sendFile(path.join(__dirname, ""));
    else res.redirect("/")
  });


//LOGGING OUT
/*
app.post("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).send("Could not log out");
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
*/


// set external port for express server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});