import { Schema, model, models } from "mongoose";

const RecordSchema = new Schema({
  createdOn: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required"]
  },
  wpm: {
    type: Number,
    required: [true, "WPM is required"]
  },
  accuracy: {
    type: Number,
    required: [true, "Accuracy is required"]
  },
  num_words: {
    type: Number,
    required: [true, "Number of words is required"]
  }
})

const Record = models.Record || model("Record", RecordSchema);

export default Record;