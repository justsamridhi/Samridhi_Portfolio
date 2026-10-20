import mongoose from 'mongoose';

const guestbookSchema = new mongoose.Schema({
  gridData: {
    type: [String], // 256 entries representing colors (or 'transparent')
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Guestbook = mongoose.model('Guestbook', guestbookSchema);
export default Guestbook;
