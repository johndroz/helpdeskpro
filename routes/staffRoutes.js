const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('../models/userModel');
const ticketModel = require('../models/ticketModel');
const {requireRole} = require("../middleware/requireRole");
const router = express.Router();

router.get("/", requireRole("IT_Staff"), (req, res)=>{
    res.sendFile(path.join(__dirname, '../pages/staff/staff.html'));
});

router.get("/tickets", requireRole("IT_Staff"), (req, res)=>{
    res.sendFile(path.join(__dirname, "../pages/staff/staff-tickets.html"));
});

router.get("/tickets/details", requireRole("IT_Staff"), async (req, res)=>{
    res.sendFile(path.join(__dirname, "../pages/staff/staff-ticket-details.html"));
});

router.get("/api/ticket", requireRole("IT_Staff"), async (req, res) =>{
    const user = req.session.user;
    ticketId = req.query.id;

    try{
        const ticket = await ticketModel.findTicketById(ticketId);
        if (ticket){
            return res.json({
                success: true, ticket
            });
        } else {
            return res.json({success: false, message: "Something was wrong."});
        }
    } catch(err){
        console.log(err)
        return res.json({success: false});
    }
});

router.get("/api/tickets", requireRole("IT_Staff"), async (req, res) =>{
    const user = req.session.user;
    try{
        const tickets = await ticketModel.findTickets();
        if (tickets){
            return res.json({
                success: true, tickets
            });
        } else {
            return res.json({success: false, message: "Something was wrong."});
        }
    } catch(err){
        console.log(err);
        return res.json({success: false});
    }
});


module.exports = router;