import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    photo: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false, // for admin approval before showing it publicly
    },
    rating: {
      type: Number,
      default: 0,
    },
    
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
