import mongoose, { Schema, Document } from 'mongoose';

interface HostInfo {
  name: string;
  image: string;
  responseRate: number;
  responseTime: string;
  joined: string;
}

interface Rules {
  checkIn: string;
  checkOut: string;
  pets: boolean;
  smoking: boolean;
  parties: boolean;
}

interface LocationDetails {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IProperty extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  beds: number;
  baths: number;
  guests: number;
  amenities: string[];
  isSuperhost: boolean;
  isNewListing: boolean;
  discount: number;
  availability: string;
  host: HostInfo;
  rules: Rules;
  location_details: LocationDetails;
  owner: string;
  ownerEmail: string;
  inventory: Date[];
  bookings: number;  
  status: string;    
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: Number,
    reviews: Number,
    images: [String],
    beds: Number,
    baths: Number,
    guests: Number,
    amenities: [String],
    isSuperhost: Boolean,
    isNewListing: Boolean,
    discount: Number,
    availability: String,
    host: {
      name: String,
      image: String,
      responseRate: Number,
      responseTime: String,
      joined: String,
    },
    rules: {
      checkIn: String,
      checkOut: String,
      pets: Boolean,
      smoking: Boolean,
      parties: Boolean,
    },
    location_details: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    owner: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    inventory: { type: [Date], default: [] },
    bookings: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Property ||
  mongoose.model<IProperty>('Property', PropertySchema);
