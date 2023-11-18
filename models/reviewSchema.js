const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  comment: String,
  rating: Number,
  dateTime: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review