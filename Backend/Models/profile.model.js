import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  avatar: { type: String }, // URL to the avatar image
}, { timestamps: true });

export const Profile = mongoose.model('Profile', profileSchema);


