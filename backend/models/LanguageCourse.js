import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
    },
    CourseFee: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const languageCourseSchema = new mongoose.Schema(
  {
    couresName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    levels: [levelSchema],
  },
  { timestamps: true }
);

const LanguageCourse = mongoose.model("LanguageCourse", languageCourseSchema);

export default LanguageCourse;
