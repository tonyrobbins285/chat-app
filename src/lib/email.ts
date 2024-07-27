import { createTransport } from "nodemailer";

type SendEmailProps = {
  email: string;
  token: string;
  type: "VERIFY" | "RESET";
};

async function sendEmail({ email, token, type }: SendEmailProps) {
  const link = `${process.env.CLIENT_URL}/auth/verify?code=${token}&email=${email}`;

  try {
    const transport = createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        password: process.env.NODEMAILER_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"SocialEcho" <${USER}>`,
      to: email,
      subject: "Verify your email address",
      html: verifyEmailHTML(name, verificationLink, verificationCode),
    });

    const newVerification = new EmailVerification({
      email,
      verificationCode,
      messageId: info.messageId,
      for: "signup",
    });

    await newVerification.save();

    res.status(200).json({
      message: `Verification email was successfully sent to ${email}`,
    });
  } catch (err) {
    console.log(
      "Could not send verification email. There could be an issue with the provided credentials or the email service.",
    );
    res.status(500).json({ message: "Something went wrong" });
  }

  try {
    const transport = createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        password: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "hieuho285@gmail.com",
      to: "recipient@example.com",
      subject: "Hello from Nodemailer",
      text: "This is a test email sent using Nodemailer.",
    };
  } catch (error) {
    throw new Error("Internal Error");
  }
}

const verifyEmail = async (req, res, next) => {
  const { code, email } = req.query;

  try {
    const [isVerified, verification] = await Promise.all([
      User.findOne({ email: { $eq: email }, isEmailVerified: true }),
      EmailVerification.findOne({
        email: { $eq: email },
        verificationCode: { $eq: code },
      }),
    ]);

    if (isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (!verification) {
      return res
        .status(400)
        .json({ message: "Verification code is invalid or has expired" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: { $eq: email } },
      { isEmailVerified: true },
      { new: true },
    ).exec();

    await Promise.all([
      EmailVerification.deleteMany({ email: { $eq: email } }).exec(),
      new UserPreference({
        user: updatedUser,
        enableContextBasedAuth: true,
      }).save(),
    ]);

    req.userId = updatedUser._id;
    req.email = updatedUser.email;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
