import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { serverErrorResponse } from '@/lib/apiResponse';

export async function POST(req: Request) {
  try {
    const model = google('gemini-2.5-flash')
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    const result = streamText({ model, prompt, });

    console.log(result)

    return result.toUIMessageStreamResponse;
  } catch (error) {

    // if (APICallError.isInstance(error)) {
    //   const errorMessage = "Faliure during: generating from Ai";
    //   console.error(errorMessage, error)
    //   return serverErrorResponse(errorMessage)
    // }
    // else {

    const errorMessage = "Faliure during: suggesting Messages";
    console.error(errorMessage, error)
    return serverErrorResponse(errorMessage)
    // }
  }
}