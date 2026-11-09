const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('../models/userModel');
const router = express.Router();

//GET LOGIN FORM
router.get('/', (req, res)=>{
    //check if user is logged in.
    if(req.session && req.session.user){
        const role = req.session.user.role;
        if(role == "Employee") return res.redirect("/employees");
        else if (role === 'IT_Staff') return res.redirect("/staff");
    }
    return res.sendFile(path.join(__dirname, "../index.html"));
});

//POST FOR LOGIN FORM
router.post('/login', async (req, res) => {
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
      userID: user.id,
      email: user.email,
      role: user.role
    };
    //redirect user based on role
    if (user.role === 'Employee') return res.redirect("/employees");
    else if (user.role === 'IT_Staff') return res.redirect("/staff");
    else res.redirect("/")
  });

  //LOGOUT OF SESSION
  router.post("/exit", (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).send("Could not log out");
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });


  module.exports = router;