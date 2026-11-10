const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('../models/userModel');
const ticketModel = require('../models/ticketModel');
const {requireRole} = require("../middleware/requireRole");
const router = express.Router();

router.get("/", requireRole("Employee"), (req, res)=>{
    res.sendFile(path.join(__dirname, '../pages/employees/employee.html'));
});

router.get("/tickets", requireRole("Employee"), (req, res)=>{
    res.sendFile(path.join(__dirname, "../pages/employees/employee-tickets.html"));
});

router.post("/tickets/create", requireRole("Employee"), async (req, res)=>{
    //get the form data and call the ticketModel to create the ticket.
    const { title, category_id, priority, description } = req.body;

    try {
        const ticket = await ticketModel.createTicket({title: title, description: description, priority: priority, userId: req.session.user.userId, categoryId: category_id});
        return res.redirect(`details?id=${ticket.id}`)
    } catch (err){
        console.log(err);
        return res.json({
            success: false,
            message: "The ticket was not created"
        });
    }
});

router.get("/tickets/details", requireRole("Employee"), async (req, res)=>{
    res.sendFile(path.join(__dirname, "../pages/employees/employee-ticket-details.html"));
});

router.get("/api/ticket", requireRole("Employee"), async (req, res) =>{
    const user = req.session.user;
    ticketId = req.query.id;

    try{
        const ticket = await ticketModel.findTicketById(ticketId);
        if(!ticket) return res.json({success: false, message: "Ticket was not found."})
        if (ticket.user_id == user.userId){
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

router.get("/api/tickets", requireRole("Employee"), async (req, res) =>{
    const user = req.session.user;
    try{
        const tickets = await ticketModel.findTicketsByUserId(user.userId);
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