import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.FAQ || mongoose.model('FAQ', faqSchema); 