const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  age: Number,
  gender: String,
  profilePicture: String,
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
});

const User = mongoose.model('User', userSchema);
module.exports = User