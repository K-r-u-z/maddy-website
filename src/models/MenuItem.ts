import mongoose from 'mongoose';

export interface MenuItemDocument extends mongoose.Document {
  title: string;
  description: string;
  price: string;
  quantity: string;
  image?: string;
  isVisible: boolean;
  isSoldOut: boolean;
  showPrice: boolean;
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
  quantity: {
    type: String,
    required: true,
    default: '1'
  },
  image: {
    type: String,
    default: ''
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isSoldOut: {
    type: Boolean,
    default: false,
  },
  showPrice: {
    type: Boolean,
    default: true,
    required: true,
  },
}, {
  timestamps: true,
});

// Add a pre-save middleware to ensure showPrice is set
menuItemSchema.pre('save', function(next) {
  if (this.showPrice === undefined) {
    this.showPrice = true;
  }
  next();
});

const MenuItem = mongoose.models.MenuItem || mongoose.model<MenuItemDocument>('MenuItem', menuItemSchema);
export default MenuItem; 