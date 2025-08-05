import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { errorResponse, serverErrorResponse, successResponse } from "@/lib/apiResponse";

const UsernameQuerySchema = z.object({
  username: usernameValidation
})

export async function GET(request: Request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)
    const queryParam = {
      username: searchParams.get("username")
    }

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return errorResponse(usernameErrors?.length > 0 ?
        usernameErrors : "Invalid query parameters", 400);
    }

    const { username } = result.data
    const existingVerifiedUsername = await UserModel.findOne({ username, isVerified: true })

    if (existingVerifiedUsername) {
      return errorResponse("Username already taken", 200);
    } else {
      return successResponse("Username is unique")
    }

  } catch (error) {
    console.error("Error checking username", error)
    return serverErrorResponse("Error checking username")
  }
}