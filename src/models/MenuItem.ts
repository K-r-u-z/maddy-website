import mongoose from 'mongoose';

export interface MenuItemDocument extends mongoose.Document {
  title: string;
  description: string;
  price: string;
  image: string;
  isVisible: boolean;
  isSoldOut: boolean;
}

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isSoldOut: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const MenuItem = mongoose.models.MenuItem || mongoose.model<MenuItemDocument>('MenuItem', menuItemSchema);
export default MenuItem; 