import Feedback from "@models/Feedback";
import { connectToDB } from "@utils/database"

export const POST = async (req) => {
  const { message } = await req.json();
  if (!message) {
    return new Response(JSON.stringify({
      error: "Require message"
    }), {status: 400})
  }
  
  try {
    await connectToDB();
    Feedback.create({
      message
    })

    return new Response(JSON.stringify({
      message: "Successfully sent a feedback"
    }), {status: 200})
  } catch(error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500});
  }
}