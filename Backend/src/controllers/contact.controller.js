const prisma = require("../config/db");

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    // REQUIRED VALIDATION
    if (!firstName || !email || !message) {
      return res.status(400).json({
        message: "First name, email and message are required",
      });
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // PHONE VALIDATION (only if provided)
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          message: "Invalid phone number (must be 10 digits)",
        });
      }
    }

    // MESSAGE LENGTH
    if (message.length < 10) {
      return res.status(400).json({
        message: "Message must be at least 10 characters",
      });
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
      },
    });

    res.status(201).json({
      message: "Contact submitted successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// GET ALL CONTACTS
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc", // latest first
      },
    });

    res.status(200).json({
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};