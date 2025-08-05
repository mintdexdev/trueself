import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { errorResponse, serverErrorResponse, successResponse } from "@/lib/apiResponse";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json()
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({ username: decodedUsername })

    if (!user)
      return errorResponse("user Not found", 404)

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true
      await user.save()

      return successResponse("Account verified Successfully")
    } else if (!isCodeNotExpired) {
      return errorResponse("Verification Code is Expired")
    }
    else {
      return errorResponse("Verification Code is Incorrect")
    }

  } catch (error) {
    console.error("Error verifying user", error)
    return serverErrorResponse("Error checking code")
  }
}