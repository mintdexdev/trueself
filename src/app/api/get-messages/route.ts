import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { errorResponse, successResponse, serverErrorResponse } from "@/lib/apiResponse";
import { User } from "next-auth";
import mongoose from "mongoose";
import UserModel from "@/model/User";
import { use } from "react";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User
  if (!session || !session.user)
    return errorResponse("Not Authenticated")

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$meesages' } } }
    ])

    if (!user) {
      return errorResponse(`User not found`)
    }

    if (user.length === 0) {
      return successResponse(`No messages`)
    }

    return successResponse("User Found", 200, { messages: user[0].messages })
  } catch (error) {
    const errorMessage = "Faliure during: getting Messages";
    console.error(errorMessage, error)
    return serverErrorResponse(errorMessage)
  }

}