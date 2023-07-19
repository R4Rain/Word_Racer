import User from "@models/User";
import { connectToDB } from "@utils/database";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const POST = async (req) => {
  const {email, password} = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({
      "error": "Require email & password"
    }), {status: 400})
  }

  try {
    await connectToDB();
    const user = await User.findOne({ email }).exec();
    if(!user) {
      return new Response(JSON.stringify({
        "error": "User not found"
      }), {status: 404});
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if(!passwordMatched) {
      return new Response(JSON.stringify({
        "error": "Password do not match"
      }), {status: 403});
    }
    // create a token
    const token = jwt.sign(
      {name: user.name,email: user.email},
      process.env.TOKEN_KEY,
      {expiresIn: '2h'}
    );
    return new Response(JSON.stringify({
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: token
      }
    }), {status: 200});
  } catch(error) {
    return new Response(JSON.stringify({
      error
    }), {status: 500})
  }
}