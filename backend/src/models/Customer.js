import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)


