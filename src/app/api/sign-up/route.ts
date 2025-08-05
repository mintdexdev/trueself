import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'
import { sendVerification } from '@/helpers/sendVerificationEmail'
import { errorResponse, serverErrorResponse, successResponse } from "@/lib/apiResponse";

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { username, email, password } = await request.json()
    const existingUserVerifiedByUsername = await UserModel.findOne(
      {
        username,
        isVerified: true,
      }
    )
    if (existingUserVerifiedByUsername)
      return errorResponse("Username already taken")

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const existingUserByEmail = await UserModel.findOne({ email })
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return errorResponse("Email already exist")
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 1000 * 3600);
        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: []
      })
      await newUser.save()
    }

    // send verification email
    const emailResponse = await sendVerification(email, username, verifyCode)

    if (!emailResponse.success)
      return errorResponse(emailResponse.message, 400)

    return successResponse("user registered successfully, Please verify email")
  } catch (error) {
    console.error("Error registring user", error)
    return serverErrorResponse("Error registring user")
  }
}