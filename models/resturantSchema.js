const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  description: String,
  logo: String,
  address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  branches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Type' }],
});
restaurantSchema.index({ 'address.location': '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant