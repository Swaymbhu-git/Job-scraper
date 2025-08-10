import mongoose from 'mongoose';

const foundJobSchema = new mongoose.Schema({
  jobUrl: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('FoundJob', foundJobSchema);