import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const About = mongoose.models.About || mongoose.model('About', AboutSchema);

export default About; 