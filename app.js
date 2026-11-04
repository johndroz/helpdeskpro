const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');


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
        if(role == "Employee") return res.sendFile(path.join(__dirname, ""));
        else if (role === 'Staff') return res.sendFile(path.join(__dirname, ""));
        else return res.sendFile(path.join(__dirname, "index.html"));
    }
    
    res.sendFile(path.join(__dirname, "pages/login.html"));
});

// ROUTE FOR LOGIN AUTHENTICATION
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = userModel.findUserByEmail(email);
    //send error as query parameters for failed logins to display to user
    if (!user || user.isActive == 0) {
        return res.redirect("/login?error=user")
    } 

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch){
        return res.redirect("/login?error=invalid")
    }
    //create session for successful login
    req.session.user = {
      userID: user.userID,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.roleName
    };
    //redirect user based on role
    if (role.roleName === 'Employee') return res.sendFile(path.join(__dirname, ""));
    else if (role.roleName === 'Support') return res.sendFile(path.join(__dirname, ""));
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