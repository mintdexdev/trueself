import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse, serverErrorResponse } from "@/lib/apiResponse";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !session.user)
    return errorResponse("Not Authenticated")

  const { acceptMessages } = await request.json()

  const userId = user._id;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    )

    if (!updatedUser)
      return errorResponse("Message Accept status update Failed")

    return successResponse("Message Accept status updated successfully")
  } catch (error) {
    const errorMessage = "Faliure during: Message Accept status update"
    console.error(errorMessage, error)
    return errorResponse(errorMessage)
  }

}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !session.user)
    return errorResponse("Not Authenticated")

  try {
    const userId = user._id;
    const foundUser = await UserModel.findById(userId)

    if (!foundUser)
      return errorResponse("User not found", 404);

    return successResponse("User Found", 200, { isAcceptingMessages: foundUser.isAcceptingMessage });

  } catch (error) {
    const errorMessage = "Faliure during: getting Message Accept status";
    console.error(errorMessage, error)
    return serverErrorResponse(errorMessage)
  }
}