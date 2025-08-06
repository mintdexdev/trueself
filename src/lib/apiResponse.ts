import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export function successResponse(
  message: string,
  status: number = 200,
  options?: {
    isAcceptingMessages?: boolean;
    messages?: Message[];
  }
) {
  const response: ApiResponse = {
    success: true,
    message,
    ...(options?.isAcceptingMessages !== undefined && {
      isAcceptingMessages: options.isAcceptingMessages,
    }),
    ...(options?.messages !== undefined && {
      messages: options.messages,
    }),
  };

  return NextResponse.json(response, { status });
}


export function errorResponse(
  message: any,
  status: number = 400
) {
  return NextResponse.json({
    success: false,
    message
  }, { status });
}

export function serverErrorResponse(
  message: string,
  status: number = 500
) {
  return NextResponse.json({
    success: false,
    message: `${message} ---Internal Server Error---`
  }, { status });
}