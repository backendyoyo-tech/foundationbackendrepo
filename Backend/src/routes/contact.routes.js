const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
 
//POST DATA
router.post("/", contactController.createContact);

// GET DATA
router.get("/", contactController.getAllContacts);

module.exports = router;