import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  stripePaymentId: string;
}

const BookingSchema = new Schema<IBooking>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  stripePaymentId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
