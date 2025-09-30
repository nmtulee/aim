import mongoose from 'mongoose';

const studyWorkSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true, 
    },
    title: {
      type: String,
      required: true,
      default: 'Study and Work Abroad',
    },
    subtitle: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    whyCountry: {
      description: {
        type: String,
        required: true,
      },
      points: [{
        type: String,
        required: true,
       }], 
    },
    whoCanApply: {
      description: {
        type: String,
        required: true,
       },
      requirements: [{
        type: String,
        required: true,
      }], 
    },
    howWeHelp: {
      description: {
        type: String,
        required: true,
      },
      services: [{
        type: String,
        required: true,
      }], 
    },
    whyChooseUs: {
      points: [{
        type: String,
        required: true,
       }],
    },
  },
  { timestamps: true }
);

const StudyWork = mongoose.model('StudyWork', studyWorkSchema);

export default StudyWork;
