import User from "@models/User";
import { connectToDB } from "@utils/database";
import { ObjectId } from "mongodb";

export const GET = async (request, { params }) => {
  const { id } = params;
  try{
    await connectToDB();
    if(ObjectId.isValid(id)) {
      const user = await User.findById(id);
      const sorted = await User.find({}).sort({"highestWPM.wpm": -1, "highestWPM.taken": 1});
      const rank = sorted.findIndex(e => e._id.toString() === id);

      if(user) {
        return new Response(JSON.stringify({
          id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          highestWPM: user.highestWPM,
          rank: rank + 1
        }), {status: 200})
      }  
    }
    return new Response(JSON.stringify({
      error: "User not found"
    }), {status: 404});

  } catch(error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500});
  }
}

export const PATCH = async(request, { params }) => {
  const { id } = params;
  try{
    await connectToDB();
    if(ObjectId.isValid(id)) {
      const {name, email, picture} = await request.json();
      const user = await User.findById(id);
      if(user) {
        if(!name || !email) {
          return new Response(JSON.stringify({
            error: "Name and email are required"
          }), {status: 400});
        }

        if(email !== user.email) {
          const existEmail = await User.exists({email});
  
          if(existEmail) {
            return new Response(JSON.stringify({
              error: "Email already exists"
            }), {status: 409})
          }
        }
        user.name = name;
        user.email = email;
        if(picture) {
          user.picture = picture;
        }
        await user.save();

        return new Response(JSON.stringify({
          message: "Successfully updated"
        }), {status: 200});
      }
    }
    return new Response(JSON.stringify({
      error: "User not found"
    }), {status: 404});
  } catch(error) {
    console.log(error);
    return new Response(JSON.stringify({
      error: error.message
    }), {status: 500});
  }
}