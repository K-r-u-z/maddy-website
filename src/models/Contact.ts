import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact; 