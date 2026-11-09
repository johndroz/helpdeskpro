const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const userModel = require('../models/userModel');
const {requireRole} = require("../middleware/requireRole");
const router = express.Router();

module.exports = router;