import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { errorResponse, successResponse, serverErrorResponse } from "@/lib/apiResponse";
import { User } from "next-auth";
import UserModel from "@/model/User";

export async function DELETE(request: Request, { params }: { params: any }) {
  await dbConnect();

  const messageId = params.messageid;
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User
  if (!session || !session.user)
    return errorResponse("Not Authenticated")

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    )
    if (updatedResult.modifiedCount === 0) {
      return errorResponse("Message not Found or already Deleted", 404)
    }

    return successResponse("Message Deleted", 200)
  } catch (error) {
    const errorMessage = "Faliure during: deleting Message";
    console.error(errorMessage, error)
    return serverErrorResponse(errorMessage)
  }
}