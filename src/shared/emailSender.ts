import nodemailer from "nodemailer";

export const emailSender = async (
  to: string,
  html: string,
  subject: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 2525,
      secure: false, 
      auth: {
        user: "88af50003@smtp-brevo.com", 
        pass: "8bpBA0zPsrY473IZ", 
      },
    });
    const mailOptions = {
      from: `<smt.team.pixel@gmail.com>`, 
      to, 
      subject, 
      text: html.replace(/<[^>]+>/g, ""),
      html, 
    };

    const info = await transporter.sendMail(mailOptions);

    return info.messageId;
  } catch (error) {
    // @ts-ignore
    console.error(`Error sending email: ${error.message}`);
    throw new Error("Failed to send email. Please try again later.");
  }
};
