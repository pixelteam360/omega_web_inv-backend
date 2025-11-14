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
        user: "957d42001@smtp-brevo.com", 
        pass: "dL2PIRtxMbacsUCj", 
      },
    });
    const mailOptions = {
      from: `<customersupport@alphapulsefit.com>`, 
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
