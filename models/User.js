import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    picture: {
      key: {
        type: String,
        default: null
      },
      url: {
        type: String,
        default: null
      }
    },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      min: [6, 'Password must be at least 6 characters long']
    },
    highestWPM: {
      wpm: {
        type: Number,
        default: 0
      },
      taken: {
        type: Date,
        default: Date.now
      }
    }
})

const User = models.User || model("User", UserSchema);

export default User;