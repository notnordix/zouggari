"use server"

import nodemailer from "nodemailer"

interface EmailData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendContactEmail(data: EmailData) {
  try {
    // Check if required environment variables are defined
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.EMAIL_FROM ||
      !process.env.EMAIL_TO
    ) {
      throw new Error("Missing required email configuration environment variables")
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Contact Form: ${data.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <h2>Message:</h2>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return { success: true, message: "Email sent successfully" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to send email" }
  }
}
