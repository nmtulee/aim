import mongoose from 'mongoose';

const languageEnrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LanguageCourse',
      required: true,
    },
    selectedLevel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LanguageEnroll = mongoose.model('LanguageEnroll', languageEnrollSchema);

export default LanguageEnroll;
