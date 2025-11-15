import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import crypto from "crypto";
import { emailSender } from "../../../shared/emailSender";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      profileCompleted: true,
      role: true,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    role: userData.role,
    profileCompleted: userData.profileCompleted,
    token: accessToken,
  };
};

const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const result = await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });

  // Generate a new OTP
  const otp = Number(crypto.randomInt(1000, 9999));

  // Set OTP expiration time to 10 minutes from now
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Create the email content
  const html = `
<div style="font-family: Arial, sans-serif; padding: 30px; background: linear-gradient(135deg, #FB4958, #d63d4a); border-radius: 8px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
        
        <h2 style="font-size: 26px; text-align: center; margin-bottom: 20px; font-weight: bold; color: #FB4958;">
            Password Reset Verification
        </h2>

        <p style="font-size: 16px; color: #444; line-height: 1.6; text-align: center;">
            Use the verification code below to reset your password.
        </p>

        <p style="font-size: 36px; font-weight: bold; color: #FB4958; text-align: center; margin: 25px 0;">
            ${otp}
        </p>

        <div style="text-align: center; margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                This code will expire in <strong>10 minutes</strong>.  
            </p>
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                If you did not request a password reset, please ignore this email.
            </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #999;">
                Best Regards,<br/>
                <span style="font-weight: bold; color: #FB4958;">AlphaPulse</span><br/>
            </p>
        </div>
    </div>
</div>
`;

  // Send the OTP email to the user
  await emailSender(userData.email, html, "Password Reset Verification Code");

  // Update the user's OTP and expiration in the database
  await prisma.user.update({
    where: { id: userData.id },
    data: {
      otp: otp,
      expirationOtp: otpExpires,
    },
  });

  return { message: "Reset password OTP sent to your email successfully" };
};

const resendOtp = async (email: string) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // Generate a new OTP
  const otp = Number(crypto.randomInt(1000, 9999));

  // Set OTP expiration time to 5 minutes from now
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  // Create email content
const html = `
<div style="font-family: Arial, sans-serif; padding: 30px; background: linear-gradient(135deg, #FB4958, #d63d4a); border-radius: 8px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">

        <h2 style="font-size: 26px; text-align: center; margin-bottom: 20px; font-weight: bold; color: #FB4958;">
            Your New Verification Code
        </h2>

        <p style="font-size: 16px; color: #444; line-height: 1.6; text-align: center;">
            Here is your new OTP code. Please use it to complete the verification process.
        </p>

        <p style="font-size: 36px; font-weight: bold; color: #FB4958; text-align: center; margin: 25px 0;">
            ${otp}
        </p>

        <div style="text-align: center; margin-bottom: 20px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                This OTP will expire in <strong>5 minutes</strong>.
            </p>
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                If you did not request this code, please ignore this email.
            </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #999;">
                Best Regards,<br/>
                <span style="font-weight: bold; color: #FB4958;">AlphaPulse</span><br/>
            </p>
        </div>

    </div>
</div>
`;


  // Send the OTP to user's email
  await emailSender(user.email, html, "Resend OTP");

  // Update the user's profile with the new OTP and expiration
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: otp,
      expirationOtp: otpExpires,
    },
  });

  return { message: "OTP resent successfully" };
};

const verifyForgotPasswordOtp = async (payload: {
  email: string;
  otp: number;
}) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // Check if the OTP is valid and not expired
  if (
    user.otp !== payload.otp ||
    !user.expirationOtp ||
    user.expirationOtp < new Date()
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // Update the user's OTP, OTP expiration, and verification status
  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: null, // Clear the OTP
      expirationOtp: null, // Clear the OTP expiration
      varifiedEmail: true,
    },
  });

  return { message: "OTP verification successful" };
};

const resetPassword = async (payload: { password: string; email: string }) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // Update the user's password in the database
  await prisma.user.update({
    where: { email: payload.email },
    data: {
      password: hashedPassword, // Update with the hashed password
      otp: null, // Clear the OTP
      expirationOtp: null, // Clear OTP expiration
    },
  });

  return { message: "Password reset successfully" };
};

export const AuthServices = {
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  resendOtp,
  verifyForgotPasswordOtp,
};
