import dbConnect from "@/lib/dbConnect";
import { errorResponse, successResponse, serverErrorResponse } from "@/lib/apiResponse";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json()

  try {
    const user = await UserModel.findOne({ username })
    if (!user) return errorResponse("User Not Found", 404)

    //  is user accepting the messages?
    if (!user?.isAcceptingMessages)
      return errorResponse("User not accepting messages")

    const newMessage = { content, createdAt: new Date() }
    user.messages.push(newMessage as Message)
    await user.save()

    return successResponse("Message Sent Successfully")

  } catch (error) {
    const errorMessage = "Faliure during: sending Message";
    console.error(errorMessage, error)
    return serverErrorResponse(errorMessage)
  }
}