const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const { EMAIL_SENDER, RESEND_API_KEY } = require("../config");

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function sendMail(data) {
  if (EMAIL_SENDER === undefined || RESEND_API_KEY === undefined) {
    console.log("[!] Config Error!");
    throw new Error("[!] Config Error!");
    // return;
  }

  // Transporter instance
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 587,
    auth: {
      user: "resend",
      pass: RESEND_API_KEY,
    },
  });

  // Handlebar Options
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(__dirname, "..", "views"),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname, "..", "views"),
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));

  // Mail Options
  const mailOptions = {
    from: EMAIL_SENDER,
    to: data.email,
    subject: "CLI Email 📩",
    template: "email",
    context: {
      title: "Successful sent email ✔",
      username: capitalize(data.username),
      url: data.url,
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[#] Email sent: ${info.response}`);
  } catch (err) {
    console.log(`[!] Error occurred while sending email: ${err}`);
  }
}

module.exports = { sendMail };
