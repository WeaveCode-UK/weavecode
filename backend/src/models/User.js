import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['user'] },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)


