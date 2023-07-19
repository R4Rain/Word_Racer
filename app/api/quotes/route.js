import Quote from "@models/Quote";
import { connectToDB } from "@utils/database"


export const GET = async () => {
  try {
    await connectToDB();
    const quote = await Quote.aggregate().sample(1);
    if(!quote) {
      return new Response(JSON.stringify({
        error: "Quote not found"
      }), {status: 404})
    }
    return new Response(JSON.stringify({
      desc: quote[0].desc
    }))
  } catch(error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500});
  }
}