const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  city: String,
  district: String,
  street: String,
  location: {
    type: { type: String,default:'Point' },
    coordinates: [Number],
  },
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address

