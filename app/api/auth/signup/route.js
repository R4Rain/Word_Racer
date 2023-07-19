import User from "@models/User";
import { connectToDB } from "@utils/database";
import * as bcrypt from 'bcrypt';

export const POST = async (req) => {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({
        error: "Require name, email, & password"
      }), {status: 400})
    }

    try{
      await connectToDB();
      // Check whether user exists
      const existsUser = await User.findOne({email}).exec();

      if(existsUser) {
          return new Response(JSON.stringify({
            error: "User already exists, please change your email"
          }), {status: 409})
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      User.create({
        name,
        email,
        password: encryptedPassword
      })
      return new Response(JSON.stringify({
          message: "User successfully signed up"
      }), {status: 200})
    } catch(error) {
      return new Response(JSON.stringify({
          error: error
      }), {status: 500})
    }
}