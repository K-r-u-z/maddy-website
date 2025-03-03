import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export interface AdminDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Define methods
adminSchema.methods = {
  comparePassword: async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
};

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Use type assertion to ensure proper typing
const Admin = (mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', adminSchema)) as mongoose.Model<AdminDocument>;
export default Admin; 