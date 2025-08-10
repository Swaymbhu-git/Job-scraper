import mongoose from 'mongoose';

const WatchListSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  selector: {
    type: String,
    required: true,
  },
});

export default mongoose.model('WatchList', WatchListSchema);