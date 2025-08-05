import { NextResponse } from "next/server";

export function successResponse(
  message: string,
  status: number = 200,
  data?: any
) {
  return NextResponse.json({
    success: true,
    message,
    ...(data !== undefined && { data })
  }, { status });
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