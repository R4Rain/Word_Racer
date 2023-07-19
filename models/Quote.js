import { Schema, model, models } from 'mongoose';

const QuoteSchema = new Schema({
  desc: {
    type: String,
    required: [true, 'Description is required']
  }
})

const Quote = models.Quote || model("Quote", QuoteSchema);

export default Quote;