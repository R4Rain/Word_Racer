import Record from "@models/Record";
import User from "@models/User";
import { connectToDB } from "@utils/database";
import { ObjectId } from "mongodb";

export const POST = async (req) => {
  const { userId, wpm, accuracy, num_words } = await req.json();
  if (!userId) {
    return new Response(JSON.stringify({
      error: "Require user id"
    }), {status: 400});
  }

  try {
    await connectToDB();
    if(ObjectId.isValid(userId)) {
      const userExist = await User.findById(userId);

      if(!userExist) {
        return new Response(JSON.stringify({
          error: "User not exist"
        }), {status: 404})
      }

      const newRecord = new Record({
        user: userId,
        wpm,
        accuracy,
        num_words
      })
      await newRecord.save();

      const highestRecord = await Record.find({user: userId}).sort({wpm: -1}).limit(1);
      if(highestRecord) {
        userExist.highestWPM.wpm = highestRecord[0].wpm;
        userExist.highestWPM.taken = highestRecord[0].createdOn;
        await userExist.save();
      }

      return new Response(JSON.stringify({
        message: "Record has been submitted"
      }), {status: 200})
    }
    return new Response(JSON.stringify({
      error: "User Id is not valid"
    }), {status: 400})

  } catch(error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500})
  }
}