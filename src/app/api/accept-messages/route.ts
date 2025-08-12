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
      { isAcceptingMessages: acceptMessages },
      { new: true }
    )


    if (!updatedUser)
      return errorResponse("Faliure: Accept Messages status not updated")

    return successResponse("Success: Accept Messages status updated")
  } catch (error) {
    const errorMessage = "Faliure during: Message Accept status update"
    console.error(errorMessage, error)
    return errorResponse(errorMessage)
  }

}

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  // if user is not authenticated
  if (!session || !session.user)
    return errorResponse("Not Authenticated")

  // User is authenticated
  try {
    // Retrieve the user from the database using the ID
    const userId = user._id;
    const foundUser = await UserModel.findById(userId)

    // User not found
    if (!foundUser)
      return errorResponse("User not found", 404);

    return successResponse("User Found", 200, { isAcceptingMessages: foundUser.isAcceptingMessages });

  } catch (error) {
    const errorMessage = "Faliure during: getting Message Accept status";
    console.error(errorMessage, error)
    return serverErrorResponse(errorMessage)
  }
}