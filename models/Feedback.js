import { Schema, model, models } from 'mongoose';

const FeedbackSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Message is required']
  }
})

const Feedback = models.Feedback || model("Feedback", FeedbackSchema);

export default Feedback;