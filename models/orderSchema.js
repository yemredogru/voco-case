const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  dateTime: { type: Date, default: Date.now },
});

orderSchema.pre('save', async function (next) {
  const order = this;
  const existingReview = await Review.findOne({ user: order.user, restaurant: existingOrder.restaurant, order: order._id });
  if (existingReview) {
    throw new Error('Bu restoran için zaten bir yorum ve puan verilmiş.');
  }

  next();

  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order