import mongoose from 'mongoose';

interface PriceQuantityPair {
  price: string;
  quantity: string;
}

export interface MenuItemDocument extends mongoose.Document {
  title: string;
  description: string;
  priceQuantities: PriceQuantityPair[];
  image?: string;
  isVisible: boolean;
  isSoldOut: boolean;
  showPrice: boolean;
}

const priceQuantitySchema = new mongoose.Schema({
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  }
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priceQuantities: {
    type: [priceQuantitySchema],
    required: true,
    default: [{ price: '0', quantity: '1' }]
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