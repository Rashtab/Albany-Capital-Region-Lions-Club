import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const gmailPass = process.env["GMAIL_APP_PASSWORD"];
  if (!gmailPass) {
    req.log.error("GMAIL_APP_PASSWORD is not set");
    res.status(500).json({ error: "Email service not configured" });
    return;
  }

  const subjectLabels: Record<string, string> = {
    general: "General Inquiry",
    membership: "Membership",
    sponsorship: "Sponsorship",
    events: "Events",
    other: "Other",
  };
  const subjectLabel = subjectLabels[subject] ?? subject;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lionsclubalbanycapitalregion@gmail.com",
      pass: gmailPass,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background: #1a3a8c; padding: 24px; text-align: center;">
        <h1 style="color: #f5c800; margin: 0; font-size: 22px;">Albany Capital Region Lions Club</h1>
        <p style="color: #ffffff; margin: 6px 0 0; font-size: 14px;">New Contact Form Submission</p>
      </div>
      <div style="padding: 28px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px; color: #555;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #1a3a8c;">${email}</a></td>
          </tr>
          ${phone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td></tr>` : ""}
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Subject</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subjectLabel}</td>
          </tr>
        </table>
        <div style="margin-top: 20px;">
          <p style="font-weight: bold; color: #555; margin-bottom: 8px;">Message</p>
          <div style="background: #f9f9f9; border-left: 4px solid #f5c800; padding: 16px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
        </div>
        <p style="margin-top: 24px; font-size: 13px; color: #888;">Reply directly to this email to respond to ${name} at ${email}.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Albany Lions Club Website" <lionsclubalbanycapitalregion@gmail.com>`,
      to: "lionsclubalbanycapitalregion@gmail.com",
      replyTo: email,
      subject: `[Contact Form] ${subjectLabel} — ${name}`,
      html,
    });

    req.log.info({ name, email, subject }, "Contact form email sent");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact form email");
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
