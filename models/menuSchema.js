const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  content: String,
  image: String,
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu