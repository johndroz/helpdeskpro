const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('../models/userModel');
const {requireRole} = require("../middleware/requireRole");
const router = express.Router();

router.get("/", requireRole("Employee"), (req, res)=>{
    res.sendFile(path.join(__dirname, '../pages/employees/employee.html'));
});

router.post("/tickets/create", requireRole("Employee"), (req, res)=>{
    res.send("received");
    //get the form data and call the ticketModel to create the ticket.
})


module.exports = router;