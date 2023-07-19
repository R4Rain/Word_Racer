import Record from "@models/Record";
import { connectToDB } from "@utils/database"
import { ObjectId } from "mongodb";

export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    await connectToDB();
    if(ObjectId.isValid(id)) {
      const record = await Record.find({ user: id }).sort({createdOn: -1});
      return new Response(JSON.stringify({
        data: record
      }), {status: 200});
    } 
    return new Response(JSON.stringify({
      error: "User id is not valid"
    }), {status: 400});
  } catch(error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500});
  }
}