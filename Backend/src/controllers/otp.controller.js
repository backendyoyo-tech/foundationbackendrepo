const prisma = require("../config/db");
const jwt = require("jsonwebtoken");

// const transporter = require("../config/mailer"); // 🔒 keep for future

// 🔢 Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email or mobile required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobile: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: {
        identifier,
        otp,
        expiresAt
      }
    });

    // ================= EMAIL (FUTURE USE) =================
    /*
    if (identifier.includes("@")) {
      await transporter.sendMail({
        from: `"Foundation App" <${process.env.EMAIL_USER}>`,
        to: identifier,
        subject: "Your OTP Code",
        html: `
          <h2>OTP Verification</h2>
          <h1>${otp}</h1>
          <p>Expires in 5 minutes</p>
        `,
      });
    }
    */

    // ================= TEMP: CONSOLE OTP =================
    console.log("=================================");
    console.log("OTP for", identifier, "is:", otp);
    console.log("=================================");

    // 👉 optional (for easy testing in Postman)
    res.json({
      message: "OTP generated (check console)",
      otp, // ⚠️ remove this in production
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const record = await prisma.otp.findFirst({
      where: { identifier, otp },
      orderBy: { createdAt: "desc" }
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobile: identifier }
        ]
      }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // delete OTP after use
    await prisma.otp.delete({
      where: { id: record.id }
    });

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};