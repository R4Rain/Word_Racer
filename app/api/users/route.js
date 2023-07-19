import User from "@models/User";
import { connectToDB } from "@utils/database";

export const GET = async (req, res) => {
  const { searchParams } = new URL(req.url);
  const page  = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  try{
    await connectToDB();
    const skip = (page - 1) * limit;
    const count = await User.estimatedDocumentCount();
    const sorted = await User.find({}).sort({"highestWPM.wpm": -1, "highestWPM.taken": 1}).limit(limit).skip(skip);
    const filtered = sorted.map((user) => {
      return {
        id: user._id,
        name: user.name,
        picture: user.picture,
        highestWPM: user.highestWPM,
        image: user.image
      }
    })
    const pageCount = Math.ceil(count / limit);

    return new Response(JSON.stringify({
      count,
      pageCount,
      users: filtered
    }), {status: 200});

  } catch(error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500})
  }
}