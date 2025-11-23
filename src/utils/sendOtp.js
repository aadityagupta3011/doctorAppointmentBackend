import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const message = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`
  };

  await transporter.sendMail(message);
};
