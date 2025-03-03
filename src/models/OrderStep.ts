import mongoose from 'mongoose';

const orderStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.OrderStep || mongoose.model('OrderStep', orderStepSchema); 