import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'completed'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Delete the model if it exists to prevent the "Cannot overwrite model once compiled" error
if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}

const Contact = mongoose.model('Contact', contactSchema);

export default Contact; 