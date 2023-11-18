const branchSchema = new mongoose.Schema({
  name: String,
  address:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }]
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch